import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const cmsModelExampleRouter = createTRPCRouter({
  delete: adminProcedure
    .input(
      z.object({
        exampleId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { exampleId } = input;
      return await ctx.db.modelExample.delete({
        where: {
          id: exampleId,
        },
      });
    }),
  update: adminProcedure
    .input(
      z.object({
        exampleId: z.string(),
        inputJson: z.string(),
        outputJson: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { exampleId, inputJson, outputJson } = input;
      const parsedExample = JSON.parse(inputJson);
      const output = JSON.parse(outputJson);
      return await ctx.db.modelExample.update({
        where: { id: exampleId },
        data: {
          paramJson: parsedExample,
          output,
        },
      });
    }),
});
