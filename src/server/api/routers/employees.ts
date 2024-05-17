import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { byStoreInput } from "~/server/api/schemas/common";

import {
  createEmployeeInput,
  updateEmployeeInput,
} from "~/server/api/schemas/employees";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { employees, employeeStore } from "~/server/db/schema";

export const employeesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createEmployeeInput)
    .mutation(async ({ ctx, input }) => {
      const { storeId, ...data } = input;
      await ctx.db.transaction(async (tx) => {
        await tx
          .insert(employees)
          .values({
            ...data,
            createdBy: ctx.session.user.id,
          })
          .onConflictDoUpdate({
            target: employees.id,
            set: {
              name: data.name,
              email: data.email,
              phone: data.phone,
            },
          });

        // After creating an employee, link to store
        await tx.insert(employeeStore).values({
          employeeId: input.id,
          storeId,
        });

        // TODO: Send email to employee with login link
      });
    }),
  find: protectedProcedure
    .input(z.object({ id: z.string().min(1).max(32) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.employees.findFirst({
        columns: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
        where: eq(employees.id, input.id),
      });
    }),
  byStore: protectedProcedure
    .input(byStoreInput)
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: employees.id,
          name: employees.name,
          email: employees.email,
          phone: employees.phone,
          isOwner: eq(employees.id, employeeStore.employeeId).mapWith(Boolean),
          isCurrentEmployee: eq(employees.userId, ctx.session.user.id).mapWith(
            Boolean,
          ),
        })
        .from(employees)
        .innerJoin(employeeStore, eq(employees.id, employeeStore.employeeId))
        .where(eq(employeeStore.storeId, input.storeId))
        .orderBy(desc(employees.createdAt));
    }),
  update: protectedProcedure
    .input(updateEmployeeInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(employees)
        .set(input)
        .where(eq(employees.id, input.id));
    }),
});
