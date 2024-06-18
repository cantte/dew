import type { TypeOf } from "zod";
import uuid from "~/lib/uuid";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { createOrderInput } from "~/server/api/schemas/orders";
import { orderItems, orders } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof createOrderInput>;
};

const createOrder = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const id = uuid();

    await tx.insert(orders).values({
      ...input,
      id: id,
      createdBy: ctx.session.user.id,
    });

    const items = input.items.map((item) => ({
      ...item,
      id: uuid(),
      orderId: id,
      createdBy: ctx.session.user.id,
    }));

    await tx.insert(orderItems).values(items);
  });
};

export default createOrder;
