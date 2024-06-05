import { desc, eq, sum } from "drizzle-orm";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import { products, saleItems } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
};

const mostSoldProducts = async ({ ctx }: Options) => {
  return await ctx.db
    .select({
      id: products.id,
      name: products.name,
      quantity: sum(saleItems.quantity),
      amount: sum(saleItems.salePrice),
      profit: sum(saleItems.profit),
    })
    .from(products)
    .innerJoin(saleItems, eq(products.id, saleItems.productId))
    .groupBy(products.id)
    .orderBy(desc(sum(saleItems.quantity)))
    .limit(3);
};

export default mostSoldProducts;
