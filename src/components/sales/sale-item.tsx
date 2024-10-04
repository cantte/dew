import { BadgePercent, Minus, Plus, Trash } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import type { TypeOf } from 'zod'
import UpdateSalePriceDialog from '~/app/(dashboard)/sales/create/update-sale-price.dialog'
import { Button } from '~/components/ui/button'
import { applyDiscount } from '~/lib/utils'
import type { createSaleInput } from '~/server/api/schemas/sales'
import { formatToCurrency } from '~/text/format'
import { api } from '~/trpc/react'

type FormValues = TypeOf<typeof createSaleInput>

type Props = {
  item: FormValues['items'][number]
  index: number
  product: string

  onIncreaseQuantity: () => void
  onDecreaseQuantity: () => void
  onRemove: () => void

  onLoadDiscounts: (newPrice: number) => void
}

export const SaleItem = ({
  item,
  index,
  product,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemove,
  onLoadDiscounts,
}: Props) => {
  const productId = item.productId
  // biome-ignore lint/correctness/useExhaustiveDependencies: keep initial salePrice
  const salePrice = useMemo(() => item.salePrice, [])

  const { isFetching, data } = api.product.searchDiscounts.useQuery(
    {
      id: productId,
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run when data changes
  useEffect(() => {
    if (!data || data.length === 0) return

    const finalPrice = applyDiscount(salePrice, data)

    onLoadDiscounts(finalPrice)
  }, [data])

  return (
    <div className="grid grid-cols-1 gap-2 rounded border p-2 md:grid-cols-3 md:gap-1">
      <div className="grid gap-1">
        <span>{product}</span>
        <span className="flex space-x-2 text-muted-foreground text-xs">
          {isFetching && <span>Cargando descuentos...</span>}
          {!isFetching && <span>{formatToCurrency('es-CO', salePrice)}</span>}
        </span>
      </div>

      <div className="flex items-center gap-2 md:justify-center">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-7"
          disabled={item.quantity === 1}
          onClick={onDecreaseQuantity}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="font-semibold">{item.quantity}</span>

        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-7"
          onClick={onIncreaseQuantity}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 md:justify-end">
        {data && data.length > 0 && <BadgePercent className="h-4 w-4" />}

        <span>{formatToCurrency('es-CO', item.quantity * item.salePrice)}</span>

        <UpdateSalePriceDialog productName={product} index={index} />

        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="h-7 w-7"
          onClick={onRemove}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
