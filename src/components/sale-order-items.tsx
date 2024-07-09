import type { RouterOutputs } from '~/trpc/shared'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

type Props = {
  items:
    | NonNullable<RouterOutputs['sale']['find']>['saleItems']
    | NonNullable<RouterOutputs['order']['find']>['orderItems']
}

export const SaleOrderItems = ({ items }: Props) => {
  return (
    <div className="h-full rounded border p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Precio de venta</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.product?.name ?? 'No encontrado'}</TableCell>
              <TableCell>
                {Intl.NumberFormat('es-CO').format(item.quantity)}
              </TableCell>
              <TableCell>
                {Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                }).format(item.salePrice)}
              </TableCell>
              <TableCell>
                {Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                }).format(item.quantity * item.salePrice)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
