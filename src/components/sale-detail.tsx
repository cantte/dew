import React from "react";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { type RouterOutputs } from "~/trpc/shared";

type Props = {
  sale: NonNullable<
    RouterOutputs["sale"]["find"] | RouterOutputs["sale"]["findPublic"]
  >;
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
          <div>
            <div className="flex flex-col">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Cliente
              </h4>
              <p className="text-muted-foreground">{sale.customer.name}</p>
            </div>

            <Separator className="my-4" />

            <div className="flex flex-col">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Resumen
              </h4>
              <p className="text-muted-foreground">
                Productos vendidos:{" "}
                {Intl.NumberFormat("es-CO").format(sale.saleItems.length)}
              </p>

              <p className="text-muted-foreground">
                Total:{" "}
                {Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(sale.amount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetail;
