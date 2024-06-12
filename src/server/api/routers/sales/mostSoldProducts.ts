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
      quantity: sum(saleItems.quantity).mapWith(Number),
      amount: sum(saleItems.salePrice).mapWith(Number),
      profit: sum(saleItems.profit).mapWith(Number),
    })
    .from(products)
    .innerJoin(saleItems, eq(products.id, saleItems.productId))
    .groupBy(products.id)
    .orderBy(desc(sum(saleItems.quantity)))
    .limit(3);
};

export default mostSoldProducts;
