import { eq, isNotNull } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { linkToStoreInput } from "~/server/api/schemas/employees";
import {
  employeeStore,
  employees,
  roles,
  userPreferences,
} from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof linkToStoreInput>;
};

const linkEmployeeToStore = async ({ ctx, input }: Options) => {
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
      .insert(userPreferences)
      .values({
        userId: ctx.session.user.id,
        storeId: input.storeId,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          storeId: input.storeId,
        },
      });

    const employeeRole = await tx.query.roles.findFirst({
      columns: {
        id: true,
      },
      where: eq(roles.name, "employee"),
    });

    await tx
      .insert(employeeStore)
      .values({
        employeeId: input.employeeId,
        storeId: input.storeId,
        roleId: employeeRole?.id,
      })
      .onConflictDoNothing();
  });
};

export default linkEmployeeToStore;
