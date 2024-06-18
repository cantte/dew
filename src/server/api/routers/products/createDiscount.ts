import { v4 as uuid } from "uuid";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { createProductDiscountInput } from "~/server/api/schemas/products";
import { productsDiscounts } from "~/server/db/schema/products";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof createProductDiscountInput>;
};

const createProductDiscount = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const discountId = uuid();
    await tx.insert(productsDiscounts).values({
      ...input,
      id: discountId,
      startDate: input.startDate.toISOString().split("T")[0]!,
      endDate: input.endDate.toISOString().split("T")[0]!,
      createdBy: ctx.session.user.id,
    });
  });
};

export default createProductDiscount;
