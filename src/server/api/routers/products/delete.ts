import { eq, sql } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byProductIdInput } from "~/server/api/schemas/products";
import { products } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byProductIdInput>;
};

const deleteProduct = async ({ ctx, input }: Options) => {
  await ctx.db
    .update(products)
    .set({ deletedAt: sql`now()` })
    .where(eq(products.id, input.id));
};

export default deleteProduct;
