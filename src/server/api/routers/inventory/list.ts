import { and, desc, eq, isNull, sql } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byStoreInput } from "~/server/api/schemas/common";
import { inventory, products } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byStoreInput>;
};

const listInventory = async ({ ctx, input }: Options) => {
  return await ctx.db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      stock: inventory.stock,
      quantity: inventory.quantity,
      isLowStock: sql<boolean>`inventory.quantity <= inventory.stock`,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(eq(inventory.storeId, input.storeId), isNull(products.deletedAt)),
    )
    .orderBy(desc(products.createdAt));
};

export default listInventory;
