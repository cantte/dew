import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { createStoreInput, findStoreInput } from "~/server/api/schemas/stores";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { stores, userPreferences } from "~/server/db/schema";

export const storesProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(createStoreInput)
    .mutation(async ({ ctx, input }) => {
      const storeId = uuid();
      await ctx.db.insert(stores).values({
        ...input,
        id: storeId,
        createdBy: ctx.session.user.id,
      });

      await ctx.db
        .insert(userPreferences)
        .values({
          userId: ctx.session.user.id,
          storeId: storeId,
        })
        .onConflictDoUpdate({
          target: userPreferences.userId,
          set: {
            storeId,
          },
        });
    }),
  find: protectedProcedure
    .input(findStoreInput)
    .query(async ({ ctx, input }) => {
      return ctx.db.query.stores.findFirst({
        where: eq(stores.id, input.id),
      });
    }),
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.query.stores.findMany({
      where: eq(stores.createdBy, ctx.session.user.id),
    });
  }),
});
