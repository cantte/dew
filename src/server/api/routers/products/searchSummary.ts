import { eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byProductIdInput } from "~/server/api/schemas/products";
import { productSummaries } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byProductIdInput>;
};

const searchProductSummary = async ({ ctx, input }: Options) => {
  return await ctx.db.query.productSummaries.findFirst({
    where: eq(productSummaries.productId, input.id),
  });
};

export default searchProductSummary;
