import { ShoppingCart } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import type { TypeOf } from 'zod'
import { SaleItem } from '~/components/sales/sale-item'
import type { createSaleInput } from '~/server/api/schemas/sales'
import type { RouterOutputs } from '~/trpc/shared'

type FormValues = TypeOf<typeof createSaleInput>

type Props = {
  products: RouterOutputs['product']['list']
}

export const SaleItems = ({ products }: Props) => {
  const form = useFormContext<FormValues>()
  const items = form.watch('items')

  const increaseQuantity = (index: number) => {
    form.setValue(
      'items',
      items.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )
  }

  const decreaseQuantity = (index: number) => {
    form.setValue(
      'items',
      items.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    )
  }

  const removeProduct = (index: number) => {
    form.setValue(
      'items',
      items.filter((_, i) => i !== index),
    )
  }

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product?.name ?? 'Producto no encontrado'
  }

  return (
    <div className="grid gap-1.5">
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 p-4 text-muted-foreground">
          <ShoppingCart className="h-8 w-8" />
          <span className="text-xs">No hay productos en la venta</span>
        </div>
      )}
      {items.map((item, index) => (
        <SaleItem
          key={`${item.productId}-${index}`}
          item={item}
          index={index}
          product={getProductName(item.productId)}
          onIncreaseQuantity={() => increaseQuantity(index)}
          onDecreaseQuantity={() => decreaseQuantity(index)}
          onRemove={() => removeProduct(index)}
        />
      ))}
    </div>
  )
}
