import { and, eq } from "drizzle-orm";
import type { TypeOf } from "zod";
import NewSale from "~/emails/new-sale";
import uuid from "~/lib/uuid";
import type { TRPCAuthedContext } from "~/server/api/procedures/authed";
import upsertSaleSummary from "~/server/api/routers/sales/upsertSummary";
import type { createSaleInput } from "~/server/api/schemas/sales";
import {
  customers,
  inventory,
  saleItems,
  sales,
  stores,
} from "~/server/db/schema";
import resend from "~/server/email/resend";

type Options = {
  ctx: TRPCAuthedContext;
  input: TypeOf<typeof createSaleInput>;
};

const createSale = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const code = uuid();
    await tx.insert(sales).values({
      ...input,
      code: code,
      createdBy: ctx.session.user.id,
    });

    const saleCode = code;
    const items = input.items.map((item) => ({
      ...item,
      id: uuid(),
      saleCode,
      createdBy: ctx.session.user.id,
    }));

    await tx.insert(saleItems).values(items);

    const soldProducts = items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    }));

    for (const soldProduct of soldProducts) {
      const [product] = await tx
        .select({
          quantity: inventory.quantity,
        })
        .from(inventory)
        .where(
          and(
            eq(inventory.productId, soldProduct.id),
            eq(inventory.storeId, input.storeId),
          ),
        );

      if (product === undefined) {
        tx.rollback();
        throw new Error("Product not found");
      }

      if (product.quantity < soldProduct.quantity) {
        tx.rollback();
        throw new Error("Insufficient product quantity");
      }

      await tx
        .update(inventory)
        .set({
          quantity: product.quantity - soldProduct.quantity,
        })
        .where(
          and(
            eq(inventory.productId, soldProduct.id),
            eq(inventory.storeId, input.storeId),
          ),
        );
    }

    const saleSummary = {
      date: new Date(),
      amount: input.amount,
      profit: input.items.reduce((acc, item) => item.profit + acc, 0),
      products: input.items.reduce((acc, item) => item.quantity + acc, 0),
      storeId: input.storeId,
    };

    await upsertSaleSummary({ tx, input: saleSummary });

    // Send email to customer
    const [customer] = await tx
      .select({
        email: customers.email,
        name: customers.name,
      })
      .from(customers)
      .where(eq(customers.id, input.customerId));

    if (customer === undefined) {
      return;
    }

    if (customer.email === null) {
      return;
    }

    const [store] = await tx
      .select({
        name: stores.name,
      })
      .from(stores)
      .where(eq(stores.id, input.storeId));

    if (store === undefined) {
      return;
    }

    await resend.emails.send({
      from: process.env.RESEND_EMAIL!,
      to: customer.email,
      subject: "Nueva venta registrada",
      react: NewSale({
        name: customer.name,
        total: input.amount,
        products: input.items.reduce((acc, item) => item.quantity + acc, 0),
        date: new Date(),
        url: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}/sales/c/${code}`
          : `http://localhost:3000/sales/c/${code}`,
        store: store.name,
      }),
    });
  });
};

export default createSale;
