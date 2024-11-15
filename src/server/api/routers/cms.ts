import axios from "axios";
import { z } from "zod";
import { decrypt, encrypt } from "~/lib/crypto";
import { translateToZh } from "~/lib/llm";
import { parseReplicateParamJson } from "~/lib/utils";
import {
  adminProcedure,
  createTRPCRouter,
  superAdminProcedure,
} from "~/server/api/trpc";

export const cmsRouter = createTRPCRouter({
  fetchAllModels: adminProcedure.query(async ({ ctx, input }) => {
    return await ctx.db.aiModel.findMany({
      include: {
        categories: true,
        params: true,
        examples: true,
      },
    });
  }),

  importParams: adminProcedure
    .input(z.object({ modelId: z.string(), json: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { modelId, json } = input;

      const model = await ctx.db.aiModel.findUnique({
        where: {
          id: modelId,
        },
      });

      if (!model) return { success: false };

      const parsedParams = parseReplicateParamJson(modelId, json);
      console.log("parsedParams", parsedParams);
      const allDesc = parsedParams.map((param) => param.desc as string);
      console.log("allDesc", allDesc);
      const allDescZh = await translateToZh(allDesc);
      console.log("allDescZh", allDescZh);
      parsedParams.forEach((param, index) => {
        param.descZh = allDescZh[index];
      });
      console.log("parsedParams zh", parsedParams);

      // Delete all existing params
      await ctx.db.modelParam.deleteMany({
        where: {
          aiModelId: modelId,
        },
      });

      await ctx.db.modelParam.createMany({
        data: parsedParams,
      });

      return { success: true };
    }),

  importExample: adminProcedure
    .input(
      z.object({
        modelId: z.string(),
        inputJson: z.string(),
        outputJson: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { modelId, inputJson, outputJson } = input;

      const model = await ctx.db.aiModel.findUnique({
        where: {
          id: modelId,
        },
      });

      if (!model) return { success: false };

      const parsedExample = JSON.parse(inputJson);
      console.log("parsedExamples", parsedExample);
      const output = JSON.parse(outputJson);

      const example = await ctx.db.modelExample.create({
        data: {
          paramJson: parsedExample,
          output,
          aiModelId: modelId,
        },
      });

      return { success: true, data: example };
    }),

  createModel: adminProcedure
    .input(
      z.object({
        json: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { json } = input;
      const modelObject = JSON.parse(json);
      if (modelObject.outputSchema) {
        modelObject.outputSchema = JSON.parse(modelObject.outputSchema);
      }
      return await ctx.db.aiModel.create({
        data: modelObject,
      });
    }),

  fetchAllModelProviders: superAdminProcedure.query(async ({ ctx }) => {
    const providers = await ctx.db.modelProvider.findMany({
      orderBy: {
        name: "asc",
      },
    });
    providers.forEach((provider) => {
      provider.apiKeys = provider.apiKeys.map((apiKey) => {
        return decrypt(apiKey, process.env.MODEL_PROVIDER_ENCRYPTION_KEY!!);
      });
    });
    return providers;
  }),

  updateModelProvider: superAdminProcedure
    .input(
      z.object({
        modelProviderId: z.string(),
        apiKeys: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { modelProviderId, apiKeys } = input;

      const hashedApiKeys = apiKeys.map((apiKey) => {
        return encrypt(apiKey, process.env.MODEL_PROVIDER_ENCRYPTION_KEY!!);
      });

      const updateResult = await ctx.db.modelProvider.update({
        where: { id: modelProviderId },
        data: {
          apiKeys: hashedApiKeys,
        },
      });

      await axios.post(process.env.REFRESH_API_KEY_ENDPOINT!, {});

      return updateResult;
    }),
});
