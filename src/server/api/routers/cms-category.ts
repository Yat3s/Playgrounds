import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const cmsModelCategoryRouter = createTRPCRouter({
  // Fetch all categories
  fetchAll: adminProcedure
    .input(
      z.object({
        current: z.number().optional(),
        pageSize: z.number().optional(),
        name: z.string().optional(),
        nameZh: z.string().optional(),
        order: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { name, nameZh, order, current = 1, pageSize = 20 } = input;

      const where = {
        ...(name && { name: { contains: name } }),
        ...(nameZh && { nameZh: { contains: nameZh } }),
        ...(order !== undefined && { order }),
      };

      const skip = (current - 1) * pageSize;

      const [modelCategories, total] = await Promise.all([
        ctx.db.modelCategory.findMany({
          where,
          skip,
          take: pageSize,
          ...(order !== undefined && { orderBy: { order: "asc" } }),
        }),
        ctx.db.modelCategory.count({ where }),
      ]);

      return {
        data: modelCategories,
        total,
        pageSize,
        current,
      };
    }),

  // Fetch a category by ID
  fetchById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.db.modelCategory.findUnique({
        where: {
          id,
        },
      });
    }),

  // Create a new category
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        nameZh: z.string(),
        order: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.modelCategory.create({
        data: input,
      });
    }),

  // Update an existing category
  update: adminProcedure
    .input(
      z.object({
        modelCategoryId: z.string(),
        name: z.string(),
        nameZh: z.string().optional(),
        order: z.number().optional(),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { modelCategoryId, ...data } = input;
      return await ctx.db.modelCategory.update({
        where: { id: modelCategoryId },
        data,
      });
    }),

  // Delete a category
  delete: adminProcedure
    .input(
      z.object({
        modelCategoryId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.modelCategory.delete({
        where: {
          id: input.modelCategoryId,
        },
      });

      return { success: true };
    }),
});
