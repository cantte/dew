import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import { api } from '~/trpc/server'

const MostSoldProducts = async () => {
  const mostSoldProducts = await api.product.mostSold()

  return (
    <div className="flex flex-col space-y-2">
      <span className="font-semibold tracking-tight">
        Productos más vendidos
      </span>
      <div>
        {mostSoldProducts.length > 0 ? (
          <div className="rounded-md border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Volumen de ventas</TableHead>
                  <TableHead>Ingresos</TableHead>
                  <TableHead>Ganancias</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {mostSoldProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name ?? 'No encontrado'}</TableCell>
                    <TableCell>
                      {Intl.NumberFormat('es-CO').format(product.quantity)}
                    </TableCell>
                    <TableCell>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(product.amount)}
                    </TableCell>
                    <TableCell>
                      {Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(product.profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold">No hay productos</h3>
            <p className="text-gray-500">No se han vendido productos aún</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MostSoldProducts
