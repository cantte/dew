import { eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { findEmployeeInput } from "~/server/api/schemas/employees";
import { employees } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof findEmployeeInput>;
};

const findEmployee = async ({ ctx, input }: Options) => {
  return ctx.db.query.employees.findFirst({
    columns: {
      id: true,
      code: true,
      name: true,
      email: true,
      phone: true,
    },
    where: eq(employees.code, input.code),
  });
};

export default findEmployee;
