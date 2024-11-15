import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const predictionRouter = createTRPCRouter({
  fetchUserPredictionCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.db.prediction.count({
      where: {
        userId,
      },
    });
  }),
});
