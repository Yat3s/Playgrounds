import axios from "axios";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { createApiKey } from "./user";
import { ModelProvider, ModelStatus } from "~/lib/enums";
import { TRPCError } from "@trpc/server";

const MODEL_REQUEST_TIMEOUT = 60000 * 10;

export const modelRouter = createTRPCRouter({
  fetchAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.aiModel.findMany({
      select: {
        id: true,
        name: true,
        nameZh: true,
        desc: true,
        descZh: true,
        tags: true,
        runOn: true,
        runCount: true,
        cost: true,
        imgUrl: true,
        author: true,
        statusUrl: true,
        categories: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        runCount: "desc",
      },
    });
  }),

  fetchById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      return await ctx.db.aiModel.findUnique({
        where: {
          id,
        },
        include: {
          params: {
            orderBy: {
              order: "asc",
            },
          },
          examples: true,
        },
      });
    }),

  fetchCategories: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.modelCategory.findMany({
      select: {
        id: true,
        name: true,
        nameZh: true,
        order: true,
        icon: true,
      },
      orderBy: {
        order: "asc",
      },
    });
  }),

  toggleModelFavorite: protectedProcedure
    .input(z.object({ modelId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { modelId } = input;
      const userId = ctx.session.user.id;

      const existingFavoriteModel = await ctx.db.userFavoriteModel.findFirst({
        where: {
          userId,
          aiModelId: modelId,
        },
      });

      if (existingFavoriteModel) {
        await ctx.db.userFavoriteModel.delete({
          where: {
            id: existingFavoriteModel.id,
          },
        });
        return { success: true, message: "取消收藏成功" };
      } else {
        await ctx.db.userFavoriteModel.create({
          data: {
            aiModel: {
              connect: { id: modelId },
            },
            user: {
              connect: { id: userId },
            },
          },
        });
        return { success: true, message: "收藏成功" };
      }
    }),

  fetchAllFavoriteModels: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const models = await ctx.db.userFavoriteModel.findMany({
      where: { userId: userId },
      include: {
        aiModel: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const favoriteModels = models.map((favoriteModel) => favoriteModel.aiModel);

    return favoriteModels ?? [];
  }),

  runModel: protectedProcedure
    .input(z.object({ id: z.string(), requestBody: z.any() }))
    .mutation(async ({ ctx, input }) => {
      const { requestBody, id } = input;

      const start = Date.now();
      const userId = ctx.session.user.id;
      const existingApiKey = await ctx.db.apiKey.findFirst({
        where: {
          userId,
        },
      });
      let userApiKey = existingApiKey?.keyHash;
      if (!userApiKey) {
        userApiKey = (await createApiKey(ctx.db, userId)).apiKey;
      }

      try {
        const response = await axios.post(
          `${process.env.MODELS_API_ENDPOINT}`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userApiKey}`,
            },
            timeout: MODEL_REQUEST_TIMEOUT,
          },
        );

        const res = await response.data;
        loggingModelPrediction({
          ctx,
          id,
          userId,
          requestBody,
          res,
          runTime: Date.now() - start,
        });

        const { output } = res;
        return Array.isArray(output) ? output : [output];
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );
      }
    }),

  fetchStatus: publicProcedure
    .input(
      z.object({
        provider: z.nativeEnum(ModelProvider),
        url: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { url, provider } = input;

      if (!url) {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "URL is required",
        });
      }

      switch (provider) {
        case ModelProvider.Replicate:
          return (await axios
            .get(url)
            .then((response) => response.data.status)) as ModelStatus;
        default:
          throw new TRPCError({
            code: "UNPROCESSABLE_CONTENT",
            message: "Unsupported provider",
          });
      }
    }),
});

function loggingModelPrediction({
  ctx,
  id,
  userId,
  requestBody,
  res,
  runTime,
}: any) {
  try {
    ctx.db.aiModel
      .update({
        where: { id },
        data: {
          runCount: {
            increment: 1,
          },
        },
      })
      .then(() => {
        console.log("Run count updated successfully");
      });
    ctx.db.prediction
      .create({
        data: {
          aiModelId: id,
          userId,
          input: requestBody.input,
          output: res,
          runTime,
        },
      })
      .then(() => {
        console.log("Prediction logged successfully");
      });
  } catch (error) {
    console.error(
      "There has been a problem with logging the prediction",
      error,
    );
  }
  return;
}
