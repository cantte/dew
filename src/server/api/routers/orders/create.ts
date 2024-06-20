import { eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import NewOrderEmail from "~/emails/new-order";
import uuid from "~/lib/uuid";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import type { createOrderInput } from "~/server/api/schemas/orders";
import { customers, orderItems, orders } from "~/server/db/schema";
import resend from "~/server/email/resend";

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

    const customer = await tx.query.customers.findFirst({
      columns: {
        email: true,
        name: true,
      },
      where: eq(customers.id, input.customerId),
    });

    if (!customer?.email) {
      return;
    }

    const store = await tx.query.stores.findFirst({
      columns: {
        name: true,
      },
      where: eq(customers.id, input.storeId),
    });

    if (!store) {
      return;
    }

    await resend.emails.send({
      from: process.env.RESEND_EMAIL!,
      to: customer.email,
      subject: "Nueva orden registrada",
      react: NewOrderEmail({
        name: customer.name,
        total: input.amount,
        products: input.items.reduce((acc, item) => item.quantity + acc, 0),
        date: new Date(),
        url: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/orders/c/${id}`
          : `http://localhost:3000/orders/c/${id}`,
        store: store.name,
      }),
    });
  });
};

export default createOrder;
