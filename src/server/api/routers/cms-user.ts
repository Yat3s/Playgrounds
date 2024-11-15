import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const cmsUserRouter = createTRPCRouter({
  fetchAll: adminProcedure
    .input(
      z.object({
        current: z.number().optional(),
        pageSize: z.number().optional(),
        name: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.string().optional(),
        role: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        name,
        phoneNumber,
        email,
        role,
        current = 1,
        pageSize = 20,
      } = input;

      const where = {
        ...(name && { name: { contains: name } }),
        ...(phoneNumber && { phoneNumber: { contains: phoneNumber } }),
        ...(email && { email: { contains: email } }),
        ...((role !== undefined || role !== null) && { role }),
      };

      const skip = (current - 1) * pageSize;

      const [users, total] = await Promise.all([
        ctx.db.user.findMany({
          where,
          skip,
          take: pageSize,
        }),
        ctx.db.user.count({ where }),
      ]);

      return { data: users, total, pageSize, current };
    }),

  fetchById: adminProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.user.findUnique({
        where: { id: input.userId },
      });
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().optional().nullable(),
        phoneNumber: z.string().optional(),
        image: z.string().optional(),
        role: z.number(),
        credits: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const inputData = {
        ...input,
        email: input.email === "" ? null : input.email,
        phoneNumber: input.phoneNumber || null,
      };
      return await ctx.db.user.create({
        data: inputData,
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string().optional(),
        email: z.string().optional(),
        phoneNumber: z.string().optional(),
        image: z.string().optional(),
        role: z.number(),
        credits: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, ...updateData } = input;
      return await ctx.db.user.update({
        where: { id: userId },
        data: updateData,
      });
    }),

  delete: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.delete({
        where: { id: input.userId },
      });
    }),
});
