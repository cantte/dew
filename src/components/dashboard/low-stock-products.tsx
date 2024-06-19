import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";

const LowStockProducts = async () => {
  const store = await api.store.findCurrent();
  if (!store) {
    return null;
  }

  const lowStockProducts = await api.inventory.lowStock({
    storeId: store.id,
  });

  return (
    <>
      {lowStockProducts.length > 0 && (
        <div className="flex flex-col space-y-2">
          <span className="font-semibold tracking-tight">
            Productos bajos en stock
          </span>

          <div className="rounded-md border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      {Intl.NumberFormat("es-CO").format(product.quantity)}
                    </TableCell>
                    <TableCell>
                      {Intl.NumberFormat("es-CO").format(product.stock)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default LowStockProducts;
