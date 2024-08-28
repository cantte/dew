import { CircleDollarSign, Tag } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { formatToCurrency, formatToNumber } from '~/text/format'
import { api } from '~/trpc/server'

type Props = {
  storeId: string
}

export const ProductsOverview = async ({ storeId }: Props) => {
  const overview = await api.product.overview({
    storeId: storeId,
  })

  return (
    <div className="grid w-full grid-cols-1 gap-1 rounded border md:grid-cols-2 lg:grid-cols-4">
      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <Tag className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-sm">Productos</p>
          </div>
          <p className="font-semibold text-lg">
            {formatToNumber('es-CO', overview.products)}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-sm">Valor total</p>
          </div>
          <p className="font-semibold text-lg">
            {formatToCurrency('es-CO', overview.value)}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden lg:flex" />
      </div>

      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-sm">Costo total</p>
          </div>
          <p className="font-semibold text-lg">
            {formatToCurrency('es-CO', overview.cost)}
          </p>
        </div>

        <Separator orientation="vertical" className="hidden md:flex" />
      </div>

      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-sm">Utilidad</p>
          </div>
          <p className="font-semibold text-lg">
            {formatToCurrency('es-CO', overview.value - overview.cost)}
          </p>
        </div>
      </div>
    </div>
  )
}

export const ProductsOverviewFallback = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-1 rounded border md:grid-cols-2 lg:grid-cols-4">
      <div className="flex justify-between p-2">
        <div className="p-2">
          <div className="flex items-center space-x-2">
            <Tag className="size-3.5 text-muted-foreground" />
            <p className="font-medium text-sm">Productos</p>
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
            <p className="font-medium text-sm">Valor total</p>
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
            <p className="font-medium text-sm">Costo total</p>
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
            <p className="font-medium text-sm">Utilidad</p>
          </div>
          <p className="font-semibold text-lg">
            <Skeleton className="h-6 w-16" />
          </p>
        </div>
      </div>
    </div>
  )
}
