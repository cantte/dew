import { and, desc, eq, isNull } from "drizzle-orm";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import findCurrentStore from "~/server/api/routers/stores/findCurrent";
import { inventory, productSummaries, products } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
};

const searchMostSoldProducts = async ({ ctx }: Options) => {
  const store = await findCurrentStore({ ctx });

  if (!store) {
    throw new Error("Current store not found");
  }

  return await ctx.db
    .select({
      id: productSummaries.productId,
      name: products.name,
      quantity: productSummaries.sales,
      amount: productSummaries.amount,
      profit: productSummaries.profit,
    })
    .from(productSummaries)
    .innerJoin(products, eq(productSummaries.productId, products.id))
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(and(eq(inventory.storeId, store.id), isNull(products.deletedAt)))
    .orderBy(desc(productSummaries.sales))
    .limit(5);
};

export default searchMostSoldProducts;
