import { and, desc, eq, gt, isNull, lt } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byProductIdInput } from "~/server/api/schemas/products";
import { productsDiscounts } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byProductIdInput>;
};

const searchProductDiscounts = async ({ ctx, input }: Options) => {
  const today = new Date().toISOString().split("T")[0]!;

  return await ctx.db.query.productsDiscounts.findMany({
    where: and(
      isNull(productsDiscounts.deletedAt),
      eq(productsDiscounts.productId, input.id),
      lt(productsDiscounts.startDate, today),
      gt(productsDiscounts.endDate, today),
    ),
    orderBy: [desc(productsDiscounts.startDate)],
  });
};

export default searchProductDiscounts;
