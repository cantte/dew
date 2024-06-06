import { and, eq, isNull } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byCodeProductInput } from "~/server/api/schemas/products";
import { inventory, products } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byCodeProductInput>;
};

const findProductForSale = async ({ ctx, input }: Options) => {
  const result = await ctx.db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      description: products.description,
      quantity: inventory.quantity,
      salePrice: products.salePrice,
      purchasePrice: products.purchasePrice,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(
        eq(products.code, input.code),
        isNull(products.deletedAt),
        eq(products.createdBy, ctx.session.user.id),
      ),
    );

  if (result.length === 0) {
    return null;
  }

  return result[0];
};

export default findProductForSale;
