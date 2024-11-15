import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  CONTAINER_USER_INPUT,
  generateBlobSASParameters,
} from "~/server/azure-storage";

export const storageRouter = createTRPCRouter({
  generateUploadUrl: protectedProcedure
    .input(
      z.object({
        blobName: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { blobName } = input;
      const blobPath = `${userId}/${blobName}`;
      const url = generateBlobSASParameters(
        CONTAINER_USER_INPUT,
        blobPath,
        "rw",
        30 * 24 * 60 * 60,
      );
      console.log("generateUploadUrl", url);
      return { url };
    }),
});
