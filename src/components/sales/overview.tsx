import { CircleDollarSign, InfoIcon, ShoppingCart, Tag } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { formatToCurrency, formatToNumber } from '~/text/format'

type Props = {
  sales: number
  products: number
  amount: number
  profit: number
}

export const SalesOverview = ({ sales, products, amount, profit }: Props) => {
  return (
    <TooltipProvider>
      <div className="grid w-full grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <OverviewCard
            icon={<ShoppingCart className="size-3.5 text-muted-foreground" />}
            title="Ventas totales"
            value={formatToNumber('es-CO', sales)}
            variationRate={10}
          />
        </div>

        <div>
          <OverviewCard
            icon={<Tag className="size-3.5 text-muted-foreground" />}
            title="Productos vendidos"
            value={formatToNumber('es-CO', products)}
            variationRate={-10}
          />
        </div>

        <div>
          <OverviewCard
            icon={
              <CircleDollarSign className="size-3.5 text-muted-foreground" />
            }
            title="Ingresos generados"
            value={formatToCurrency('es-CO', amount)}
          />
        </div>

        <div>
          <OverviewCard
            icon={
              <CircleDollarSign className="size-3.5 text-muted-foreground" />
            }
            title="Ganancias generadas"
            value={formatToCurrency('es-CO', profit)}
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

        {variationRate && (
          <div className="flex items-center space-x-2">
            <Badge variant={variationRate > 0 ? 'success' : 'destructive'}>
              {variationRate > 0 ? '+' : ''}
              {variationRate}%
            </Badge>

            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="size-3.5 text-muted-foreground" />
              </TooltipTrigger>

              <TooltipContent>
                <div className="grid gap-1">
                  <span>
                    Representa la variación con respecto al periodo anterior.
                  </span>
                  <span>[ESTA FUNCIONALIDAD SE ENCUENTRA EN DESARROLLO]</span>
                </div>
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
