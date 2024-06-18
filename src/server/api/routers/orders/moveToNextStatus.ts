import { eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import { orderStatus } from "~/constants";
import uuid from "~/lib/uuid";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import upsertOrderSummary from "~/server/api/routers/orders/upsertSummary";
import type { byOrderIdInput } from "~/server/api/schemas/orders";
import { orderHistory, orderItems, orders } from "~/server/db/schema";

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

    if (nextStatus === "delivered") {
      const items = await tx.query.orderItems.findMany({
        where: eq(orderItems.orderId, input.id),
      });

      const orderSummary = {
        date: new Date(),
        amount: order.amount,
        profit: items.reduce((acc, item) => acc + item.profit, 0),
        products: items.reduce((acc, item) => acc + item.quantity, 0),
        storeId: order.storeId,
      };

      await upsertOrderSummary({ tx, input: orderSummary });
    }
  });
};

export default moveOrderToNextStatus;
