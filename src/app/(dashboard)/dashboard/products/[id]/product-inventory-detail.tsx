import { notFound } from 'next/navigation'
import { Badge } from '~/components/ui/badge'
import { api } from '~/trpc/server'

type Props = {
  id: string
}

const ProductInventoryDetail = async ({ id }: Props) => {
  const store = await api.store.findCurrent()

  if (!store) {
    return notFound()
  }

  const inventory = await api.inventory.find({
    id: id,
    storeId: store.id,
  })

  if (!inventory) {
    return notFound()
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="font-semibold">Inventario</div>
        <Badge variant={inventory.isLowStock ? 'destructive' : 'secondary'}>
          {inventory.isLowStock ? 'Bajo' : 'Normal'}
        </Badge>
      </div>

      <ul className="grid gap-2">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Unidad de medida</span>
          <span>{inventory.unit}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Stock</span>
          <span>{Intl.NumberFormat('es-CO').format(inventory.stock)}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Cantidad actual</span>
          <span>{Intl.NumberFormat('es-CO').format(inventory.quantity)}</span>
        </li>
      </ul>
    </>
  )
}

export default ProductInventoryDetail
