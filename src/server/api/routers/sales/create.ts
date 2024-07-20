import { renderToBuffer } from '@react-pdf/renderer'
import { and, eq } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import { InvoicePDFTemplate } from '~/components/pdf/invoice-template'
import NewSale from '~/emails/new-sale'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { makeCashMovement } from '~/server/api/routers/cashRegisters/make-cash-movement'
import findCustomer from '~/server/api/routers/customers/find'
import { notifyLowStock } from '~/server/api/routers/inventory/notifyLowStock'
import upsertProductsSummaries from '~/server/api/routers/products/upsertSummaries'
import upsertSaleSummary from '~/server/api/routers/sales/upsertSummary'
import findStore from '~/server/api/routers/stores/find'
import type { createSaleInput } from '~/server/api/schemas/sales'
import { inventory, saleItems, sales } from '~/server/db/schema'
import resend from '~/server/email/resend'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createSaleInput>
}

const createSale = async ({ ctx, input }: Options) => {
  await ctx.db.transaction(async (tx) => {
    const code = uuid()
    await tx.insert(sales).values({
      ...input,
      code: code,
      createdBy: ctx.session.user.id,
    })

    const saleCode = code
    const items = input.items.map((item) => ({
      ...item,
      id: uuid(),
      saleCode,
      createdBy: ctx.session.user.id,
    }))

    await tx.insert(saleItems).values(items)

    const soldProducts = items.map((item) => ({
      id: item.productId,
      quantity: item.quantity,
    }))

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
        )

      if (product === undefined) {
        tx.rollback()
        throw new Error('Product not found')
      }

      if (product.quantity < soldProduct.quantity) {
        tx.rollback()
        throw new Error('Insufficient product quantity')
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
        )
    }

    const soldProductSummaries = items.map((item) => ({
      id: uuid(),
      productId: item.productId,
      sales: item.quantity,
      amount: item.salePrice * item.quantity,
      profit: item.profit * item.quantity,
    }))

    await upsertProductsSummaries({ tx, input: soldProductSummaries })

    const saleSummary = {
      date: new Date(),
      amount: input.amount,
      profit: input.items.reduce(
        (acc, item) => item.profit * item.quantity + acc,
        0,
      ),
      products: input.items.reduce((acc, item) => item.quantity + acc, 0),
      storeId: input.storeId,
      customers: 1,
      sales: 1,
    }

    await upsertSaleSummary({ tx, input: saleSummary })

    if (input.paymentMethod === 'cash') {
      await makeCashMovement({
        tx,
        input: {
          storeId: input.storeId,
          userId: ctx.session.user.id,
          type: 'IN',
          amount: input.payment,
        },
      })

      const change = input.payment - input.amount
      if (change > 0) {
        await makeCashMovement({
          tx,
          input: {
            storeId: input.storeId,
            userId: ctx.session.user.id,
            type: 'OUT',
            amount: change,
          },
        })
      }
    }

    // Send email to customer
    const customer = await findCustomer({
      ctx,
      input: { id: input.customerId },
    })

    if (!customer?.email) {
      return
    }

    const store = await findStore({ ctx, input: { id: input.storeId } })

    if (!store) {
      return
    }

    const today = new Date()
    const fileStream = await renderToBuffer(
      InvoicePDFTemplate({
        id: code,
        date: Intl.DateTimeFormat('es-CO', {
          dateStyle: 'full',
          timeStyle: 'short',
        }).format(today),
        customer: {
          id: customer.id,
          name: customer.name,
          phone: customer.phone ?? undefined,
        },
        store: {
          name: store.name,
          nit: store.nit ?? 'No presenta',
        },
        products: input.items.map((item) => ({
          id: item.productId,
          name: item.productId, // TODO: Load product name from product
          quantity: item.quantity,
          price: item.salePrice,
        })),
        total: input.amount,
      }),
    )

    await resend.emails.send({
      from: process.env.RESEND_EMAIL!,
      to: customer.email,
      subject: 'Nueva venta registrada',
      react: NewSale({
        name: customer.name,
        total: input.amount,
        products: input.items.reduce((acc, item) => item.quantity + acc, 0),
        date: today,
        url: process.env.NEXT_PUBLIC_URL
          ? `${process.env.NEXT_PUBLIC_URL}/sales/c/${code}`
          : `http://localhost:3000/sales/c/${code}`,
        store: store.name,
      }),
      attachments: [
        {
          filename: `factura-${code}.pdf`,
          content: fileStream,
        },
      ],
    })
  })

  await notifyLowStock({ ctx, input: { storeId: input.storeId } })
}

export default createSale
