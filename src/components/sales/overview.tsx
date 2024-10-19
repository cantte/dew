import { CircleDollarSign, ShoppingCart, Tag } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { formatToCurrency, formatToNumber } from '~/text/format'

type Props = {
  sales: number
  products: number
  amount: number
  profit: number
}

export const SalesOverview = ({ sales, products, amount, profit }: Props) => {
  return (
    <div className="grid w-full grid-cols-1 gap-1 rounded border bg-card md:grid-cols-2 lg:grid-cols-4">
      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-muted-foreground text-sm">
              Ventas totales
            </p>
          </div>
          <p className="font-semibold text-lg">
            {formatToNumber('es-CO', sales)}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <Tag className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-muted-foreground text-sm">
              Productos vendidos
            </p>
          </div>
          <p className="font-semibold text-lg">
            {formatToNumber('es-CO', products)}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden lg:flex" />
      </div>

      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-muted-foreground text-sm">
              Ingesos generados
            </p>
          </div>
          <p className="font-semibold text-lg">
            {formatToCurrency('es-CO', amount)}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-muted-foreground text-sm">
              Ganancias generadas
            </p>
          </div>
          <p className="font-semibold text-lg">
            {formatToCurrency('es-CO', profit)}
          </p>
        </div>
      </div>
    </div>
  )
}

export const SalesOverviewFallback = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-1 rounded border md:grid-cols-2 lg:grid-cols-4">
      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-muted-foreground text-sm">
              Ventas totales
            </p>
          </div>
          <p className="font-semibold text-lg">
            <Skeleton className="h-6 w-16" />
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <Tag className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-muted-foreground text-sm">
              Productos vendidos
            </p>
          </div>
          <p className="font-semibold text-lg">
            <Skeleton className="h-6 w-16" />
          </p>
        </div>

        <Separator orientation="vertical" className="hidden lg:flex" />
      </div>

      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-muted-foreground text-sm">
              Ingesos generados
            </p>
          </div>
          <p className="font-semibold text-lg">
            <Skeleton className="h-6 w-16" />
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-muted-foreground text-sm">
              Ganancias generadas
            </p>
          </div>
          <p className="font-semibold text-lg">
            <Skeleton className="h-6 w-16" />
          </p>
        </div>
      </div>
    </div>
  )
}
