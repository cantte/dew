import { sql } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { upsertProductSummaryInput } from "~/server/api/schemas/products";
import { productSummaries } from "~/server/db/schema";

type DbTransaction = Parameters<
  Parameters<TRPCAuthedContext["db"]["transaction"]>[0]
>[0];

type Options = {
  tx: DbTransaction;
  input: TypeOf<typeof upsertProductSummaryInput>;
};

const upsertProductsSummaries = async ({ tx, input }: Options) => {
  const soldProductSummaries = input;
  await tx
    .insert(productSummaries)
    .values(soldProductSummaries)
    .onConflictDoUpdate({
      target: [productSummaries.productId],
      set: {
        sales: sql`${productSummaries.sales} + EXCLUDED.sales`,
        amount: sql`${productSummaries.amount} + EXCLUDED.amount`,
        profit: sql`${productSummaries.profit} + EXCLUDED.profit`,
      },
    });
};

export default upsertProductsSummaries;
