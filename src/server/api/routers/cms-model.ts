import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const cmsModelRouter = createTRPCRouter({
  fetchAll: adminProcedure
    .input(
      z.object({
        current: z.number().optional(),
        pageSize: z.number().optional(),
        name: z.string().optional(),
        modelId: z.string().optional(),
        desc: z.string().optional(),
        descZh: z.string().optional(),
        cost: z.number().optional(),
        runCount: z.number().optional(),
        estRunTime: z.number().optional(),
        runOn: z.string().optional(),
        author: z.string().optional(),
        github: z.string().optional(),
        paper: z.string().optional(),
        license: z.string().optional(),
        outputFormat: z.string().optional(),
        supportStream: z.boolean().optional(),
        provider: z.string().optional(),
        providerModelName: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const where = buildQueryFilter(input);
      const { current = 1, pageSize = 20 } = input;
      const skip = (current - 1) * pageSize;

      const [aiModels, total] = await Promise.all([
        ctx.db.aiModel.findMany({
          where,
          include: {
            categories: true,
            params: true,
            examples: true,
          },
          skip,
          take: pageSize,
        }),
        ctx.db.aiModel.count({ where }),
      ]);

      return { data: aiModels, total, pageSize, current };
    }),

  fetchById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      return await ctx.db.aiModel.findUnique({
        where: { id },
        include: { categories: true },
      });
    }),

  create: adminProcedure
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

      const { categories, ...modelDataWithoutCategories } = modelObject;

      try {
        const createdModel = await ctx.db.aiModel.create({
          data: {
            ...modelDataWithoutCategories,
            categories: {
              connect: categories.map((categoryId: string) => ({
                id: categoryId,
              })),
            },
          },
          include: { categories: true },
        });

        const categoryCreatePromises = categories.map(
          async (categoryId: string) => {
            await ctx.db.categoriesOnModels.create({
              data: {
                modelId: createdModel.id,
                categoryId,
              },
            });
          },
        );

        await Promise.all(categoryCreatePromises);
        return { success: true };
      } catch (error) {
        console.log(error);
        throw new Error("Failed to create model.");
      }
    }),

  delete: adminProcedure
    .input(
      z.object({
        aIModelId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { aIModelId } = input;
      await ctx.db.aiModel.delete({
        where: { id: aIModelId },
      });

      return { success: true };
    }),

  update: adminProcedure
    .input(
      z.object({
        aiModelId: z.string(),
        json: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { aiModelId, json } = input;
      const modelObject = JSON.parse(json);

      if (modelObject.outputSchema) {
        modelObject.outputSchema = JSON.parse(modelObject.outputSchema);
      }

      const { categories, ...updatedModelData } = modelObject;

      try {
        await ctx.db.aiModel.update({
          where: { id: aiModelId },
          data: {
            ...updatedModelData,
            categories: {
              set: categories.map((categoryId: string) => ({ id: categoryId })),
            },
          },
          include: { categories: true },
        });

        await ctx.db.categoriesOnModels.deleteMany({
          where: { modelId: aiModelId },
        });

        const categoryUpdatePromises = categories.map(
          async (categoryId: string) => {
            await ctx.db.categoriesOnModels.create({
              data: {
                modelId: aiModelId,
                categoryId,
              },
            });
          },
        );

        await Promise.all(categoryUpdatePromises);
        return { success: true };
      } catch (error) {
        console.log(error);
        throw new Error("Failed to update model or categories.");
      }
    }),

  fetchCategories: adminProcedure.query(async ({ ctx }) => {
    return await ctx.db.modelCategory.findMany({
      select: {
        id: true,
        name: true,
        nameZh: true,
        order: true,
        icon: true,
      },
      orderBy: { order: "asc" },
    });
  }),
});

const buildQueryFilter = (input: any) => {
  const {
    name,
    modelId,
    desc,
    descZh,
    cost,
    runCount,
    estRunTime,
    runOn,
    author,
    github,
    paper,
    license,
    outputFormat,
    supportStream,
    provider,
    providerModelName,
  } = input;

  return {
    ...(name && { name: { contains: name } }),
    ...(modelId && { modelId: { contains: modelId } }),
    ...(desc && { desc: { contains: desc } }),
    ...(descZh && { descZh: { contains: descZh } }),
    ...(cost !== undefined && { cost }),
    ...(runCount !== undefined && { runCount }),
    ...(estRunTime !== undefined && { estRunTime }),
    ...(runOn && { runOn: { contains: runOn } }),
    ...(author && { author: { contains: author } }),
    ...(github && { github: { contains: github } }),
    ...(paper && { paper: { contains: paper } }),
    ...(license && { license: { contains: license } }),
    ...(outputFormat && { outputFormat: { contains: outputFormat } }),
    ...(supportStream !== undefined && { supportStream }),
    ...(provider && { provider: { contains: provider } }),
    ...(providerModelName && {
      providerModelName: { contains: providerModelName },
    }),
  };
};
