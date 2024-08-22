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
    <div className="grid gap-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full border rounded">
      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <ShoppingCart className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Ventas totales</p>
          </div>
          <p className="text-lg font-semibold">
            {formatToNumber('es-CO', sales)}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <Tag className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Productos vendidos</p>
          </div>
          <p className="text-lg font-semibold">
            {formatToNumber('es-CO', products)}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden lg:flex" />
      </div>

      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Ingesos generados</p>
          </div>
          <p className="text-lg font-semibold">
            {formatToCurrency('es-CO', amount)}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Ganancias generadas</p>
          </div>
          <p className="text-lg font-semibold">
            {formatToCurrency('es-CO', profit)}
          </p>
        </div>
      </div>
    </div>
  )
}

export const SalesOverviewFallback = () => {
  return (
    <div className="grid gap-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full border rounded">
      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <ShoppingCart className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Ventas totales</p>
          </div>
          <p className="text-lg font-semibold">
            <Skeleton className="w-16 h-6" />
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <Tag className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Productos vendidos</p>
          </div>
          <p className="text-lg font-semibold">
            <Skeleton className="w-16 h-6" />
          </p>
        </div>

        <Separator orientation="vertical" className="hidden lg:flex" />
      </div>

      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Ingesos generados</p>
          </div>
          <p className="text-lg font-semibold">
            <Skeleton className="w-16 h-6" />
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Ganancias generadas</p>
          </div>
          <p className="text-lg font-semibold">
            <Skeleton className="w-16 h-6" />
          </p>
        </div>
      </div>
    </div>
  )
}
