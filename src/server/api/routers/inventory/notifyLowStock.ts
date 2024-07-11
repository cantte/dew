import { and, desc, eq, inArray, isNull, lte } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import LowStockProducsEmail from '~/emails/low-stock-products'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { byStoreInput } from '~/server/api/schemas/common'
import { inventory, products, stores, users } from '~/server/db/schema'
import resend from '~/server/email/resend'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof byStoreInput>
}

export const notifyLowStock = async ({ ctx, input }: Options) => {
  const lowStockProducts = await ctx.db
    .select({
      id: products.id,
      code: products.code,
      name: products.name,
      stock: inventory.stock,
      quantity: inventory.quantity,
    })
    .from(products)
    .innerJoin(inventory, eq(products.id, inventory.productId))
    .where(
      and(
        eq(inventory.storeId, input.storeId),
        isNull(products.deletedAt),
        lte(inventory.quantity, inventory.stock),
        eq(inventory.lowStockNotificationSended, false),
      ),
    )
    .orderBy(desc(products.createdAt))

  if (!lowStockProducts.length) {
    return
  }

  const [owner] = await ctx.db
    .select({
      email: users.email,
      store: stores.name,
    })
    .from(users)
    .innerJoin(stores, eq(users.id, stores.createdBy))
    .where(eq(stores.id, input.storeId))
    .limit(1)

  if (!owner) {
    return
  }

  await resend.emails.send({
    from: process.env.RESEND_EMAIL!,
    to: owner.email,
    subject: 'Productos con stock bajo',
    react: LowStockProducsEmail({
      storeName: owner.store,
      lowStockProducts: lowStockProducts,
      url: process.env.NEXT_PUBLIC_URL
        ? `${process.env.NEXT_PUBLIC_URL}/dashboard/products`
        : `http://localhost:3000/dashboard/products`,
    }),
  })

  const lowStockProductIds = lowStockProducts.map((p) => p.id)

  await ctx.db
    .update(inventory)
    .set({ lowStockNotificationSended: true })
    .where(inArray(inventory.productId, lowStockProductIds))
}
