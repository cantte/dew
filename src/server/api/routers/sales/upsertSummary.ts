import { sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { upsertSaleSummaryInput } from "~/server/api/schemas/sales";
import { saleSummary } from "~/server/db/schema/sales";

type DbTransaction = Parameters<
  Parameters<TRPCAuthedContext["db"]["transaction"]>[0]
>[0];

type Options = {
  tx: DbTransaction;
  input: TypeOf<typeof upsertSaleSummaryInput>;
};

const upsertSaleSummary = async ({ tx, input }: Options) => {
  await tx
    .insert(saleSummary)
    .values({
      ...input,
      id: uuid(),
      customers: 1,
      sales: 1,
      date: input.date.toISOString().split("T")[0],
    })
    .onConflictDoUpdate({
      target: [saleSummary.date, saleSummary.storeId],
      set: {
        amount: sql`${saleSummary.amount} + EXCLUDED.amount`,
        profit: sql`${saleSummary.profit} + EXCLUDED.profit`,
        products: sql`${saleSummary.products} + EXCLUDED.products`,
        customers: sql`1 + EXCLUDED.customers`,
        sales: sql`1 + EXCLUDED.sales`,
      },
    });
};

export default upsertSaleSummary;
