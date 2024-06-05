import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { paymentMethods } from "~/server/api/schemas/sales";
import { type RouterOutputs } from "~/trpc/shared";

type Props = {
  sale: NonNullable<RouterOutputs["sale"]["find"]>;
};

const SaleDetail = ({ sale }: Props) => {
  return (
    <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
      <div className="grid grow grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border p-4 md:col-span-2">
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
              {sale.saleItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product?.name ?? "No encontrado"}</TableCell>
                  <TableCell>
                    {Intl.NumberFormat("es-CO").format(item.quantity)}
                  </TableCell>
                  <TableCell>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(item.salePrice)}
                  </TableCell>
                  <TableCell>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(item.quantity * item.salePrice)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col justify-between gap-4 rounded border p-4">
          <div className="text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Resumen</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Productos vendidos
                  </span>
                  <span>
                    {Intl.NumberFormat("es-CO").format(
                      sale.saleItems.reduce(
                        (acc, item) => acc + item.quantity,
                        0,
                      ),
                    )}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(sale.amount)}
                  </span>
                </li>
              </ul>

              <Separator className="my-2" />

              <div className="font-semibold">Cliente</div>
              <p className="text-muted-foreground">
                {sale.customer
                  ? `${sale.customer.name} (${sale.customer.id})`
                  : "Mostrador"}
              </p>

              <Separator className="my-2" />

              <div className="space-y-2">
                <div className="font-semibold">Método de pago</div>
                <p className="text-muted-foreground">
                  {paymentMethods.find(
                    (method) => method.value === sale.paymentMethod,
                  )?.label ?? "Desconocido"}
                </p>
              </div>

              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total a pagar</span>
                  <span>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(sale.amount)}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Pago recibido</span>
                  <span>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(sale.payment)}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Cambio</span>
                  <span>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(sale.payment - sale.amount)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetail;
