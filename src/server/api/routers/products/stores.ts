import { eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byProductIdInput } from "~/server/api/schemas/products";
import { inventory } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byProductIdInput>;
};

const listProductStores = async ({ ctx, input }: Options) => {
  return ctx.db
    .select({
      id: inventory.storeId,
    })
    .from(inventory)
    .where(eq(inventory.productId, input.id));
};

export default listProductStores;
