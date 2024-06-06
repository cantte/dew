import { eq } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import type { TypeOf } from "zod";
import { orderStatus } from "~/constants";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { byOrderIdInput } from "~/server/api/schemas/orders";
import { orderHistory, orders } from "~/server/db/schema";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof byOrderIdInput>;
};

const moveOrderToNextStatus = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const order = await tx.query.orders.findFirst({
      where: eq(orders.id, input.id),
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const currentStatus = order.status;
    const nextStatus = orderStatus.find((s) => s.id === currentStatus)?.next;

    if (!nextStatus) {
      throw new Error("Order cannot be moved to next status");
    }

    await tx
      .update(orders)
      .set({ status: nextStatus })
      .where(eq(orders.id, input.id));

    await tx.insert(orderHistory).values({
      id: uuid(),
      orderId: input.id,
      status: nextStatus,
      createdBy: ctx.session.user.id,
    });
  });
};

export default moveOrderToNextStatus;
