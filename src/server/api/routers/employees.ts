import { desc, eq, isNotNull } from "drizzle-orm";
import { z } from "zod";
import EmployeeStoreInvitationEmail from "~/emails/employee-store-invitation";
import { byStoreInput } from "~/server/api/schemas/common";

import {
  createEmployeeInput,
  linkToStoreInput,
  updateEmployeeInput,
} from "~/server/api/schemas/employees";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { employees, employeeStore } from "~/server/db/schema";
import resend from "~/server/email/resend";

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

        // Send email to employee
        await resend.emails.send({
          from: process.env.RESEND_EMAIL!,
          to: data.email,
          subject: "Has sido invitado a la tienda",
          react: EmployeeStoreInvitationEmail({
            employeeName: data.name,
            storeName: storeId,
            url: process.env.VERCEL_URL
              ? `https://${process.env.VERCEL_URL}/stores/${storeId}/accept-invitation?employeeId=${input.id}`
              : `http://localhost:3000/stores/${storeId}/accept-invitation?employeeId=${input.id}`,
          }),
        });
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
  linkToStore: protectedProcedure
    .input(linkToStoreInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.transaction(async (tx) => {
        const result = await tx
          .select({
            hasUser: isNotNull(employees.userId).mapWith(Boolean),
          })
          .from(employees)
          .where(eq(employees.id, input.employeeId));

        if (result.length === 0) {
          try {
            tx.rollback();
          } catch (error) {
            throw new Error("Employee not found");
          }
        }

        const employee = result.at(0);
        if (employee!.hasUser) {
          try {
            tx.rollback();
          } catch (error) {
            throw new Error("Employee already linked to a user");
          }
        }

        await tx
          .update(employees)
          .set({
            userId: ctx.session.user.id,
          })
          .where(eq(employees.id, input.employeeId));

        await tx
          .insert(employeeStore)
          .values({
            employeeId: input.employeeId,
            storeId: input.storeId,
          })
          .onConflictDoNothing();
      });
    }),
});
