import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import {
  createStoreInput,
  findStoreInput,
  updateStoreInput,
} from "~/server/api/schemas/stores";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  employees,
  employeeStore,
  stores,
  userPreferences,
} from "~/server/db/schema";

export const storesProcedure = createTRPCRouter({
  create: protectedProcedure
    .input(createStoreInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const storeId = uuid();
        await tx.insert(stores).values({
          ...input,
          id: storeId,
          createdBy: ctx.session.user.id,
        });

        await tx
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

        const user = ctx.session.user;

        await tx
          .insert(employees)
          .values({
            id: user.id,
            name: user.name ?? "Sin nombre",
            email: user.email ?? "Sin email",
            userId: user.id,
            createdBy: user.id,
          })
          .onConflictDoNothing();

        await tx.insert(employeeStore).values({
          employeeId: user.id,
          storeId: storeId,
        });
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
    return ctx.db
      .select({
        id: stores.id,
        name: stores.name,
        createdAt: stores.createdAt,
      })
      .from(employeeStore)
      .innerJoin(stores, eq(employeeStore.storeId, stores.id))
      .innerJoin(employees, eq(employeeStore.employeeId, employees.id))
      .where(eq(employees.userId, ctx.session.user.id));
  }),
  update: protectedProcedure
    .input(updateStoreInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(stores).set(input).where(eq(stores.id, input.id));
    }),
});
