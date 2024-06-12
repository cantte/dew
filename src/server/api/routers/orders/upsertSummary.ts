import { sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { upsertOrderSummaryInput } from "~/server/api/schemas/orders";
import { orderSummary } from "~/server/db/schema/orders";

type DbTransaction = Parameters<
  Parameters<TRPCAuthedContext["db"]["transaction"]>[0]
>[0];

type Options = {
  tx: DbTransaction;
  input: TypeOf<typeof upsertOrderSummaryInput>;
};

const upsertOrderSummary = async ({ tx, input }: Options) => {
  await tx
    .insert(orderSummary)
    .values({
      ...input,
      id: uuid(),
      customers: 1,
      orders: 1,
      date: input.date.toISOString().split("T")[0],
    })
    .onConflictDoUpdate({
      target: [orderSummary.date, orderSummary.storeId],
      set: {
        amount: sql`${orderSummary.amount} + EXCLUDED.amount`,
        profit: sql`${orderSummary.profit} + EXCLUDED.profit`,
        products: sql`${orderSummary.products} + EXCLUDED.products`,
        customers: sql`1 + EXCLUDED.customers`,
        orders: sql`1 + EXCLUDED.orders`,
      },
    });
};

export default upsertOrderSummary;
