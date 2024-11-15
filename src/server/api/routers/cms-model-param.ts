import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const cmsModelParamRouter = createTRPCRouter({
  addDefaultParam: adminProcedure
    .input(
      z.object({
        modelId: z.string(),
        json: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { modelId, json } = input;
      const model = await ctx.db.aiModel.findUnique({
        where: {
          id: modelId,
        },
      });

      if (!model) return { success: false };
      const params = JSON.parse(json);
      params.aiModelId = modelId;
      const addDefaultParamRes = await ctx.db.modelParam.create({
        data: params,
      });

      return { success: true, data: addDefaultParamRes };
    }),

  delete: adminProcedure
    .input(
      z.object({
        paramId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { paramId } = input;
      return await ctx.db.modelParam.delete({
        where: {
          id: paramId,
        },
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        paramId: z.string(),
        json: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { paramId, json } = input;
      const modelObject = JSON.parse(json);
      modelObject.aiModel = {
        connect: {
          id: modelObject.aiModelId,
        },
      };
      delete modelObject.aiModelId;
      return await ctx.db.modelParam.update({
        where: { id: paramId },
        data: modelObject,
      });
    }),
});
