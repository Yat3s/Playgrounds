import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";
import { generateApiKey, hashApiKey, maskApiKey } from "~/lib/utils";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  sendVerifyCode: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const option = {
        method: "POST",
        timeout: 10000,
        url: `https://api.sms.jpush.cn/v1/codes`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.JIGUANG_SMS_API_KEY}`,
        },
        data: {
          mobile: input,
          sign_id: "26899",
          temp_id: "1",
        },
      };
      try {
        const response = await axios(option);
        const { msg_id: requestId } = response.data;

        return { requestId };
      } catch (error) {
        console.error("sendVerifyCode", error);
        throw new Error(process.env.ERROR_MESSAGE);
      }
    }),

  verifyCode: publicProcedure
    .input(z.object({ requestId: z.string(), code: z.string() }))
    .mutation(async ({ input }) => {
      const option = {
        method: "POST",
        timeout: 10000,
        url: `https://api.sms.jpush.cn/v1/codes/${input.requestId}/valid`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${process.env.JIGUANG_SMS_API_KEY}`,
        },
        data: {
          code: input.code,
        },
      };
      try {
        const response = await axios(option);
        const { is_valid: isValid, error } = response.data;

        if (isValid === true || error.code === 50012) {
          return { success: true };
        }

        return null;
      } catch (error) {
        console.error("verifyCode", error);
        throw new Error(process.env.ERROR_MESSAGE);
      }
    }),

  addCredits: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: { credits: { increment: input.amount * 100 } },
      });

      await ctx.db.payment.create({
        data: {
          userId: userId,
          productType: "credit",
          remark: input.amount * 100,
        },
      });

      return { success: true, newCredits: updatedUser.credits };
    }),

  fetchCredits: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const user = await ctx.db.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return { credits: user.credits };
  }),

  fetchCreditTransaction: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.db.payment.findMany({
      where: {
        userId,
        productType: {
          equals: "credit",
        },
        remark: {
          gt: 0,
        },
      },
      select: {
        id: true,
        createdAt: true,
        remark: true,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  fetchUserApiKeys: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.db.apiKey.findMany({
      where: {
        userId,
      },
    });
  }),

  createApiKey: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { name } = input;
      const existingApiKey = await ctx.db.apiKey.findFirst({
        where: {
          userId,
          name,
        },
      });

      if (existingApiKey) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Api Key already exist",
        });
      }

      const { apiKey, keyHash } = await createApiKey(ctx.db, userId, name);
      return { success: true, apiKey, keyHash };
    }),

  deleteApiKey: protectedProcedure
    .input(z.object({ apiKeyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { apiKeyId } = input;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      await ctx.db.apiKey.delete({
        where: {
          id: apiKeyId,
        },
      });

      return { success: true };
    }),

  validateUserCredits: protectedProcedure
    .input(
      z.object({
        cost: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { cost } = input;

      const user = await ctx.db.user.findUnique({
        where: { id: userId },
        select: { credits: true },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      if (user.credits < cost) {
        return { isSufficient: false, message: "余额不足，请充值" };
      }

      return { isSufficient: true };
    }),
});

export const createApiKey = async (
  db: PrismaClient,
  userId: string,
  apiKeyName: string = "Default",
) => {
  const apiKey = generateApiKey();
  const keyHash = hashApiKey(apiKey);

  await db.apiKey.create({
    data: {
      userId,
      name: apiKeyName,
      keyHash,
      displayKey: maskApiKey(apiKey),
    },
  });

  return {
    apiKey,
    keyHash,
  };
};
