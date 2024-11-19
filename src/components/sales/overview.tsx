import { CircleDollarSign, InfoIcon, ShoppingCart, Tag } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import {
  formatToCurrency,
  formatToNumber,
  formatToPercent,
} from '~/text/format'
import type { RouterOutputs } from '~/trpc/shared'

type Props = RouterOutputs['sale']['overview']

export const SalesOverview = ({ sales, products, amount, profit }: Props) => {
  return (
    <TooltipProvider>
      <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <OverviewCard
            icon={<ShoppingCart className="size-3.5 text-muted-foreground" />}
            title="Ventas totales"
            value={formatToNumber('es-CO', sales.value)}
            variationRate={sales.variationRate}
          />
        </div>

        <div>
          <OverviewCard
            icon={<Tag className="size-3.5 text-muted-foreground" />}
            title="Productos vendidos"
            value={formatToNumber('es-CO', products.value)}
            variationRate={products.variationRate}
          />
        </div>

        <div>
          <OverviewCard
            icon={
              <CircleDollarSign className="size-3.5 text-muted-foreground" />
            }
            title="Ingresos generados"
            value={formatToCurrency('es-CO', amount.value)}
            variationRate={amount.variationRate}
          />
        </div>

        <div>
          <OverviewCard
            icon={
              <CircleDollarSign className="size-3.5 text-muted-foreground" />
            }
            title="Ganancias generadas"
            value={formatToCurrency('es-CO', profit.value)}
            variationRate={profit.variationRate}
          />
        </div>
      </div>
    </TooltipProvider>
  )
}

type OverviewCardProps = {
  icon: React.ReactNode
  title: string
  value: string
  variationRate?: number
}

const OverviewCard = ({
  icon,
  title,
  value,
  variationRate,
}: OverviewCardProps) => {
  return (
    <div className="flex flex-col space-y-2 rounded-md border bg-card p-4">
      <div className="flex items-center space-x-2">
        {icon}
        <p className="font-medium text-muted-foreground text-sm">{title}</p>
      </div>

      <div className="flex items-center justify-between">
        <p className="font-semibold text-xl leading-none tracking-tight md:text-2xl">
          {value}
        </p>

        {variationRate !== undefined && variationRate !== 0 && (
          <div className="flex items-center space-x-2">
            <Badge variant={variationRate >= 0 ? 'success' : 'destructive'}>
              {formatToPercent('es-CO', variationRate)}
            </Badge>

            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="size-3.5 text-muted-foreground" />
              </TooltipTrigger>

              <TooltipContent>
                <span>
                  Representa la variación con respecto al periodo anterior.
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}

export const SalesOverviewFallback = () => {
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
