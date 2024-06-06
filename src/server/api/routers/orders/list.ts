import { desc, eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byStoreInput } from "~/server/api/schemas/common";
import { orders } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byStoreInput>;
};

const listOrders = async ({ ctx, input }: Options) => {
  return await ctx.db.query.orders.findMany({
    with: {
      customer: {
        columns: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [desc(orders.createdAt)],
    where: eq(orders.storeId, input.storeId),
  });
};

export default listOrders;
