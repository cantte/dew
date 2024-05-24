import { MinusIcon, PlusIcon, RotateCw, TrashIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { TypeOf } from "zod";
import UpdateSalePriceDialog from "~/app/(dashboard)/sales/create/update-sale-price.dialog";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  paymentMethods,
  type createSaleInput,
  type PaymentMethod,
} from "~/server/api/schemas/sales";
import type { RouterOutputs } from "~/trpc/shared";

export type FormValues = TypeOf<typeof createSaleInput>;
type Product = RouterOutputs["product"]["findForSale"];
type Customer = RouterOutputs["customer"]["find"];

type Props = {
  isCreating: boolean;
  selectedProducts: Product[];
  customer?: Customer;
};

const CheckoutStep = ({ isCreating, selectedProducts, customer }: Props) => {
  const form = useFormContext<FormValues>();

  const calculateAmount = () => {
    const items = form.getValues("items");
    const amount = items.reduce(
      (acc, item) => acc + item.quantity * item.salePrice,
      0,
    );
    form.setValue("amount", amount);
    form.setValue("payment", amount);
  };

  const getProductName = (productId: string) => {
    const product = selectedProducts.find((p) => p?.id === productId);
    return product?.name ?? "Producto no encontrado";
  };

  const onSelectPaymentMethod = (value: string) => {
    form.setValue("paymentMethod", value as PaymentMethod);
  };

  return (
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
            {form.watch("items").map((item, index) => (
              <TableRow key={item.productId}>
                <TableCell>{getProductName(item.productId)}</TableCell>
                <TableCell className="flex items-center space-x-3">
                  <Button
                    size="icon"
                    variant="secondary"
                    type="button"
                    disabled={item.quantity === 1}
                    onClick={() => {
                      const items = form.getValues("items");
                      items[index]!.quantity -= 1;
                      form.setValue("items", items);
                      calculateAmount();
                    }}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>

                  <span>
                    {Intl.NumberFormat("es-CO").format(item.quantity)}
                  </span>

                  <Button
                    size="icon"
                    variant="secondary"
                    type="button"
                    onClick={() => {
                      const items = form.getValues("items");
                      items[index]!.quantity += 1;
                      form.setValue("items", items);
                      calculateAmount();
                    }}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <span>
                      {Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(item.salePrice)}
                    </span>

                    <UpdateSalePriceDialog
                      productName={getProductName(item.productId)}
                      index={index}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(item.quantity * item.salePrice)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={() => {
                      const items = form.getValues("items");
                      items.splice(index, 1);
                      form.setValue("items", items);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
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
                    form
                      .watch("items")
                      .reduce((acc, item) => acc + item.quantity, 0),
                  )}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span>
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(form.watch("amount") ?? 0)}
                </span>
              </li>
            </ul>

            <Separator className="my-2" />

            <div className="font-semibold">Cliente</div>
            <p className="text-muted-foreground">
              {customer ? `${customer.name} (${customer.id})` : "Mostrador"}
            </p>

            <Separator className="my-2" />

            <div className="space-y-2">
              <div className="font-semibold">Método de pago</div>
              <Select
                value={form.watch("paymentMethod")}
                onValueChange={onSelectPaymentMethod}
              >
                <SelectTrigger>
                  <SelectValue defaultValue={form.watch("paymentMethod")} />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <Button type="submit" disabled={isCreating}>
          {isCreating && <RotateCw className="mr-2 h-4 w-4 animate-spin" />}
          Finalizar venta
        </Button>
      </div>
    </div>
  );
};

export default CheckoutStep;
