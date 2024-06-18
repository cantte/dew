import { eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import uuid from "~/lib/uuid";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byOrderIdInput } from "~/server/api/schemas/orders";
import { orderHistory, orders } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byOrderIdInput>;
};

const cancelOrder = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({ status: "cancelled" })
      .where(eq(orders.id, input.id));

    await tx.insert(orderHistory).values({
      id: uuid(),
      orderId: input.id,
      status: "cancelled",
      createdBy: ctx.session.user.id,
    });
  });
};

export default cancelOrder;
