import { notFound } from 'next/navigation'
import SaleDetail from '~/components/sale-detail'
import { Badge } from '~/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { api } from '~/trpc/server'

type Props = {
  params: {
    code: string
  }
}

const CustomerSaleDetailPage = async ({ params }: Props) => {
  const sale = await api.sale.findPublic({ code: params.code })

  if (!sale) {
    return notFound()
  }

  return (
    <div className="w-full max-w-7xl">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline">
                  {Intl.DateTimeFormat('es-CO', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  }).format(new Date(sale.createdAt))}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Fecha de creación de la venta</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <SaleDetail sale={sale} />
      </div>
    </div>
  )
}

export default CustomerSaleDetailPage
