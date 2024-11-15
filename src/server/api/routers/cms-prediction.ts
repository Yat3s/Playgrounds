import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { TRPCError } from "@trpc/server";
import { toJsonObject } from "~/lib/utils";

export const cmsPredictionRouter = createTRPCRouter({
  fetchAll: adminProcedure
    .input(
      z.object({
        current: z.number().optional(),
        pageSize: z.number().optional(),
        aiModel: z.string().optional(),
        User: z.string().optional(),
        createdAt: z.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { aiModel, User, createdAt, current = 1, pageSize = 20 } = input;

      const where = {
        ...(aiModel && { aiModel: { name: { contains: aiModel } } }),
        ...(User && {
          OR: [
            { User: { email: { contains: User } } },
            { User: { phoneNumber: { contains: User } } },
          ],
        }),
        ...(createdAt && { createdAt }),
      };

      const skip = (current - 1) * pageSize;

      const [predictions, total] = await Promise.all([
        ctx.db.prediction.findMany({
          where,
          include: {
            aiModel: true,
            User: true,
          },
          skip,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
        ctx.db.prediction.count({ where }),
      ]);

      return {
        data: predictions,
        total,
        pageSize,
        current,
      };
    }),

  toggleExample: adminProcedure
    .input(
      z.object({
        predictionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const prediction = await ctx.db.prediction.findUnique({
        where: { id: input.predictionId },
        include: { aiModel: true },
      });
      if (!prediction) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Prediction not found",
        });
      }

      const parsedInput = toJsonObject(prediction.input);
      const parsedOutput = prediction.output as {
        data: object;
        output: string[];
      };

      await ctx.db.prediction.update({
        where: { id: input.predictionId },
        data: { markedAsExample: !prediction.markedAsExample },
      });

      if (prediction.markedAsExample) {
        const existingExample = await ctx.db.modelExample.findFirst({
          where: {
            aiModelId: prediction.aiModelId,
            paramJson: {
              equals: parsedInput,
            },
            output: {
              equals: parsedOutput.output,
            },
          },
        });

        if (existingExample) {
          await ctx.db.modelExample.delete({
            where: { id: existingExample.id },
          });
        }
        return { success: true, message: "Example removed" };
      } else {
        await ctx.db.modelExample.create({
          data: {
            paramJson: parsedInput,
            output: parsedOutput.output,
            aiModelId: prediction.aiModelId,
          },
        });
        return { success: true, message: "Example created" };
      }
    }),
});
