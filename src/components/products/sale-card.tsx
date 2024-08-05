import { Badge } from '~/components/ui/badge'
import { formatToCurrency } from '~/text/format'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  product: Omit<
    RouterOutputs['product']['list'][number],
    'isLowStock' | 'quantity' | 'stock' | 'enabled'
  >
  onAddProduct: (productId: string) => void
}

export const ProductSaleCard = ({ product, onAddProduct }: Props) => {
  return (
    <div
      key={product.id}
      className="flex cursor-pointer flex-col gap-2 rounded border p-2 hover:bg-accent/20"
      onClick={() => onAddProduct(product.id)}
    >
      <div>
        <Badge
          variant="outline"
          className="rounded px-2 font-extralight text-[10px]"
        >
          {product.code}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <span>{product.name}</span>
      </div>

      <span className="text-muted-foreground text-xs">
        {formatToCurrency('es-CO', product.salePrice)}
      </span>
    </div>
  )
}
