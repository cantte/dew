import { and, desc, eq, isNull, sum } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byStoreInput } from "~/server/api/schemas/common";
import { inventory, products, saleItems } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byStoreInput>;
};

const getProductSuggestions = async ({ ctx, input }: Options) => {
  return ctx.db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      description: products.description,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .innerJoin(saleItems, eq(products.id, saleItems.productId))
    .groupBy(products.id)
    .where(
      and(eq(inventory.storeId, input.storeId), isNull(products.deletedAt)),
    )
    .orderBy(desc(sum(saleItems.quantity)))
    .limit(3);
};

export default getProductSuggestions;
