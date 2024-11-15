import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const cmsAppConfigRouter = createTRPCRouter({
  fetchAll: adminProcedure
    .input(
      z.object({
        current: z.number().optional(),
        pageSize: z.number().optional(),
        key: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { key, current = 1, pageSize = 20 } = input;

      const where = key ? { key: { contains: key } } : {};

      const skip = (current - 1) * pageSize;
      const [appConfigs, total] = await Promise.all([
        ctx.db.appConfig.findMany({
          where,
          skip,
          take: pageSize,
        }),
        ctx.db.appConfig.count({ where }),
      ]);

      return {
        data: appConfigs,
        total,
        pageSize,
        current,
      };
    }),

  fetchById: adminProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      return await ctx.db.appConfig.findUnique({
        where: { id },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.appConfig.create({
        data: input,
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        key: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.appConfig.update({
        where: { id },
        data,
      });
    }),

  delete: adminProcedure
    .input(
      z.object({
        appConfigId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.appConfig.delete({
        where: {
          id: input.appConfigId,
        },
      });

      return { success: true };
    }),
});
