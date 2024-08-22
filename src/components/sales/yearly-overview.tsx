import { endOfYear, startOfYear } from 'date-fns'
import { CircleDollarSign, ShoppingCart, Tag } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
import { Skeleton } from '~/components/ui/skeleton'
import { formatToCurrency, formatToNumber } from '~/text/format'
import { api } from '~/trpc/server'

export const YearlySalesOverview = async () => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const today = new Date()
  const from = startOfYear(today)
  const to = endOfYear(today)

  const overview = await api.sale.overview({
    from,
    to,
    storeId: store.id,
  })

  return (
    <div className="grid gap-2 grid-cols-2 md:grid-cols-4 w-full border rounded">
      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <ShoppingCart className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Ventas totales</p>
          </div>
          <p className="text-lg font-semibold">
            {formatToNumber('es-CO', overview.sales)}
          </p>
        </div>

        <Separator orientation="vertical" />
      </div>

      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <Tag className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Productos vendidos</p>
          </div>
          <p className="text-lg font-semibold">
            {formatToNumber('es-CO', overview.products)}
          </p>
        </div>

        <Separator orientation="vertical" />
      </div>

      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Ingesos generados</p>
          </div>
          <p className="text-lg font-semibold">
            {formatToCurrency('es-CO', overview.revenue)}
          </p>
        </div>

        <Separator orientation="vertical" />
      </div>

      <div className="p-2 flex justify-between">
        <div className="p-2">
          <div className="flex space-x-2 items-center">
            <CircleDollarSign className="size-3.5 text-muted-foreground" />
            <p className="text-sm font-medium">Ganancias generadas</p>
          </div>
          <p className="text-lg font-semibold">
            {formatToCurrency('es-CO', overview.revenue)}
          </p>
        </div>
      </div>
    </div>
  )
}

export const YearlySalesOverviewFallback = () => {
  return <Skeleton className="h-5 w-full max-w-[450px]" />
}
