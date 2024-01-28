import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { createStoreInput } from "~/server/api/schemas/stores";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { stores } from "~/server/db/schema";

export const storesProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(createStoreInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(stores).values({
        ...input,
        id: uuid(),
        createdBy: ctx.session.user.id,
      });
    }),
  find: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.stores.findFirst({
      where: eq(stores.createdBy, ctx.session.user.id),
    });
  }),
});
