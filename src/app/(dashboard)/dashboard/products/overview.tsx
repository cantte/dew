import BadgeIndicators from '~/components/badge-indicators'
import { formatToCurrency, formatToNumber } from '~/text/format'
import { api } from '~/trpc/server'

type Props = {
  storeId: string
}

const ProductsOverview = async ({ storeId }: Props) => {
  const overview = await api.product.overview({
    storeId: storeId,
  })

  const indicators = [
    {
      title: 'Productos',
      tooltip: 'Cantidad de productos registrados',
      value: formatToNumber('es-CO', overview.products),
    },
    {
      title: 'Valor total',
      tooltip: 'Valor total del inventario de productos',
      value: formatToCurrency('es-CO', overview.value),
    },
    {
      title: 'Costo total',
      tooltip: 'Costo total del inventario de productos',
      value: formatToCurrency('es-CO', overview.cost),
    },
    {
      title: 'Utilidad',
      tooltip: 'Utilidad total del inventario de productos',
      value: formatToCurrency('es-CO', overview.value - overview.cost),
    },
  ]

  return <BadgeIndicators indicators={indicators} />
}

export default ProductsOverview
