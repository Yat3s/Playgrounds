import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const configRouter = createTRPCRouter({
  fetchByKey: publicProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { key } = input;
      const config = await ctx.db.appConfig.findFirst({ where: { key } });
      if (!config) {
        throw new Error(`Config with key ${key} not found`);
      }
      return config.value;
    }),
});
