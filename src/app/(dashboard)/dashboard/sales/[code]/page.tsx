import { notFound } from "next/navigation";
import BackButton from "~/components/back-button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";

type SaleDetailPageProps = {
  params: {
    code: string;
  };
};

const SaleDetailPage = async ({ params }: SaleDetailPageProps) => {
  const sale = await api.sale.find.query({ code: params.code });

  if (!sale) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <BackButton />
      <div className="flex items-center justify-center gap-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Venta
        </h3>
        <Badge>
          {sale.paymentMethod === "cash" ? "Efectivo" : "No registrado"}
        </Badge>
      </div>

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
                    <TableCell>
                      {item.product?.name ?? "No encontrado"}
                    </TableCell>
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
    </div>
  );
};

export default SaleDetailPage;
