import { and, eq, isNotNull } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byProductIdInput } from "~/server/api/schemas/products";
import { products } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byProductIdInput>;
};

const findProductById = async ({ ctx, input }: Options) => {
  return ctx.db.query.products.findFirst({
    where: and(eq(products.id, input.id), isNotNull(products.deletedAt)),
  });
};

export default findProductById;
