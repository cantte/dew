import { CircleDollarSign, Tag } from 'lucide-react'
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
    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <OverviewCard
          icon={<Tag className="size-3.5 text-muted-foreground" />}
          title="Productos"
          value={formatToNumber('es-CO', overview.products)}
        />
      </div>

      <div>
        <OverviewCard
          icon={<CircleDollarSign className="size-3.5 text-muted-foreground" />}
          title="Valor total"
          value={formatToCurrency('es-CO', overview.value)}
        />
      </div>

      <div>
        <OverviewCard
          icon={<CircleDollarSign className="size-3.5 text-muted-foreground" />}
          title="Costo total"
          value={formatToCurrency('es-CO', overview.cost)}
        />
      </div>

      <div>
        <OverviewCard
          icon={<CircleDollarSign className="size-3.5 text-muted-foreground" />}
          title="Utilidad"
          value={formatToCurrency('es-CO', overview.value - overview.cost)}
        />
      </div>
    </div>
  )
}

type OverviewCardProps = {
  icon: React.ReactNode
  title: string
  value: string
}

const OverviewCard = ({ icon, title, value }: OverviewCardProps) => {
  return (
    <div className="flex flex-col space-y-2 rounded-md border bg-card p-4">
      <div className="flex items-center space-x-2">
        {icon}
        <p className="font-medium text-muted-foreground text-sm">{title}</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="font-semibold text-xl leading-none tracking-tight md:text-2xl">{value}</p>
      </div>
    </div>
  )
}

export const ProductsOverviewFallback = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4">
      <div>
        <Skeleton className="h-20" />
      </div>

      <div>
        <Skeleton className="h-20" />
      </div>

      <div>
        <Skeleton className="h-20" />
      </div>

      <div>
        <Skeleton className="h-20" />
      </div>
    </div>
  )
}
