import { endOfMonth, startOfMonth } from 'date-fns'
import BadgeIndicators from '~/components/badge-indicators'
import { api } from '~/trpc/server'

const SalesOverview = async () => {
  const store = await api.store.findCurrent()
  if (!store) {
    return null
  }

  const today = new Date()
  const from = startOfMonth(today)
  const to = endOfMonth(today)

  const overview = await api.sale.overview({
    from,
    to,
    storeId: store.id,
  })

  const indicators = [
    {
      title: 'Ventas',
      tooltip: 'Cantidad de ventas registradas',
      value: Intl.NumberFormat('es-CO').format(+overview.sales),
    },
    {
      title: 'Clientes',
      tooltip: 'Cantidad de clientes atendidos',
      value: Intl.NumberFormat('es-CO').format(+overview.customers),
    },
    {
      title: 'Ingresos',
      tooltip: 'Ingresos generados por las ventas',
      value: Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(+overview.revenue),
    },
    {
      title: 'Productos',
      tooltip: 'Products vendidos',
      value: Intl.NumberFormat('es-CO').format(+overview.products),
    },
  ]

  const info = `Información general de las ventas registradas en el mes de ${Intl.DateTimeFormat('es-CO', { month: 'long' }).format(new Date())}.`

  return <BadgeIndicators indicators={indicators} info={info} />
}

export default SalesOverview
