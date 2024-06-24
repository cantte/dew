import { and, eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byCodeProductInput } from "~/server/api/schemas/products";
import { products } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byCodeProductInput>;
};

const checkProductExistence = async ({ ctx, input }: Options) => {
  return ctx.db.query.products.findFirst({
    columns: {
      code: true,
    },
    where: and(
      eq(products.code, input.code),
      eq(products.createdBy, ctx.session.user.id),
    ),
  });
};

export default checkProductExistence;
