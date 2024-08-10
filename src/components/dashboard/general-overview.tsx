import { endOfMonth, startOfMonth } from 'date-fns'
import BadgeIndicators from '~/components/badge-indicators'
import { Skeleton } from '~/components/ui/skeleton'
import { api } from '~/trpc/server'

export const GeneralOverview = async () => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const today = new Date()
  const from = startOfMonth(today)
  const to = endOfMonth(today)

  const salesOverview = await api.sale.overview({
    from,
    to,
    storeId: store.id,
  })

  const customers = salesOverview.customers
  const revenue = salesOverview.revenue
  const products = salesOverview.products

  const indicators = [
    {
      title: 'Ventas',
      tooltip: 'Cantidad de ventas registradas',
      value: Intl.NumberFormat('es-CO').format(+salesOverview.sales),
    },
    {
      title: 'Clientes',
      tooltip: 'Cantidad de clientes atendidos',
      value: Intl.NumberFormat('es-CO').format(customers),
    },
    {
      title: 'Ingresos',
      tooltip: 'Ingresos generados',
      value: Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(revenue),
    },
    {
      title: 'Productos',
      tooltip: 'Products entregados',
      value: Intl.NumberFormat('es-CO').format(products),
    },
  ]

  const info = `Información general de las ordenes y ventas registradas en el mes de ${Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date())}.`

  return <BadgeIndicators indicators={indicators} info={info} />
}

export const GeneralOverviewFallback = () => {
  return <Skeleton className="h-5 w-full max-w-[450px]" />
}
