import { eq } from "drizzle-orm";
import { z } from "zod";

import { createEmployeeInput } from "~/server/api/schemas/employees";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { employees, employeeStore } from "~/server/db/schema";

export const employeesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createEmployeeInput)
    .mutation(async ({ ctx, input }) => {
      const { storeId, ...data } = input;
      await ctx.db.transaction(async (tx) => {
        await tx.insert(employees).values({
          ...data,
          createdBy: ctx.session.user.id,
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
    .input(z.object({ storeId: z.string().min(1).max(36) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.query.employeeStore.findMany({
        with: {
          employee: {
            columns: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        where: eq(employeeStore.storeId, input.storeId),
      });
    }),
});
