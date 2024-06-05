import { eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { findCustomerInput } from "~/server/api/schemas/customers";
import { customers } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof findCustomerInput>;
};

const findCustomer = async ({ ctx, input }: Options) => {
  return await ctx.db.query.customers.findFirst({
    columns: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
    where: eq(customers.id, input.id),
  });
};

export default findCustomer;
