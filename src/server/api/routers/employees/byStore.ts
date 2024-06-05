import { desc, eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byStoreInput } from "~/server/api/schemas/common";
import { employeeStore, employees } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byStoreInput>;
};

const findEmployeesByStore = async ({ ctx, input }: Options) => {
  return await ctx.db
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
};

export default findEmployeesByStore;
