import { z } from "zod";
import { openAiCall } from "~/lib/llm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const toolRouter = createTRPCRouter({
  promptFineTune: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { prompt } = input;

      const res = await openAiCall({
        systemPrompt: `You are a good prompt writer. please translate the following prompt to English if my input is non-English, then please fine-tune the following prompt to make it more suitable for the model to generate the desired output, please DO NOT change the meaning of the prompt, just response with the fine-tuned prompt.`,
        prompt: `${prompt}`,
        model: "gpt-3.5-turbo",
      });
      return res;
    }),
});
