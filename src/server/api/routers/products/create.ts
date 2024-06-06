import { v4 as uuid } from "uuid";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { createProductInput } from "~/server/api/schemas/products";
import { inventory, products } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof createProductInput>;
};

const createProduct = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const { stores, ...product } = input;
    const productId = uuid();

    await tx.insert(products).values({
      ...product,
      id: productId,
      createdBy: ctx.session.user.id,
    });

    await tx.insert(inventory).values(
      stores.map((storeId) => ({
        storeId: storeId,
        productId: productId,
        stock: 0,
        quantity: 0,
      })),
    );
  });
};

export default createProduct;
