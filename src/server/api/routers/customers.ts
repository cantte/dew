import { eq } from "drizzle-orm";
import { z } from "zod";

import { createCustomerInput } from "~/server/api/schemas/customers";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { customers } from "~/server/db/schema";

export const customersProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(createCustomerInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(customers).values({
        ...input,
        createdBy: ctx.session.user.id,
      });
    }),
  find: protectedProcedure
    .input(z.object({ id: z.string().min(1).max(32) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.customers.findFirst({
        columns: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
        where: eq(customers.id, input.id),
      });
    }),
});
