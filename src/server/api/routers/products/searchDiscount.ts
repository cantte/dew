import { desc, eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byProductIdInput } from "~/server/api/schemas/products";
import { productsDiscounts } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byProductIdInput>;
};

const searchProductDiscounts = async ({ ctx, input }: Options) => {
  return await ctx.db.query.productsDiscounts.findMany({
    where: eq(productsDiscounts.productId, input.id),
    orderBy: [desc(productsDiscounts.startDate)],
  });
};

export default searchProductDiscounts;
