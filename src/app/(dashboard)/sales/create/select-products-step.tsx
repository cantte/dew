import { useDebounce } from "@uidotdev/usehooks";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { TypeOf } from "zod";
import { Button } from "~/components/ui/button";
import { FormDescription } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { createSaleInput } from "~/server/api/schemas/sales";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

export type FormValues = TypeOf<typeof createSaleInput>;
type Product = RouterOutputs["product"]["findForSale"];

type Props = {
  onContinue: (selectedProducts: Product[]) => void;
};

const SelectProductsStep = ({ onContinue }: Props) => {
  const form = useFormContext<FormValues>();

  const [productCode, setProductCode] = useState("");
  const finalProductCode = useDebounce(productCode, 1000);
  const [productSelected, setProductSelected] = useState(false);

  const resetProduct = () => {
    setProductCode("");
    setProductSelected(false);
  };

  const {
    data: product,
    error: findProductError,
    isFetching: isFindingProduct,
  } = api.product.findForSale.useQuery(
    { code: finalProductCode },
    {
      enabled:
        finalProductCode !== undefined &&
        finalProductCode !== "" &&
        productSelected,
    },
  );
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (findProductError) {
      if (findProductError.message.includes("undefined")) {
        return;
      }
    }

    const canAddProduct =
      product !== undefined &&
      product !== null &&
      productSelected &&
      product.quantity > 0;

    if (!canAddProduct) {
      return;
    }

    const items = form.getValues("items");
    const exists = items.find((item) => item.productId === product.id);
    if (exists) {
      exists.quantity += 1;
      resetProduct();
      calculateAmount();
      return;
    }

    items.push({
      productId: product.id,
      quantity: 1,
      salePrice: product.salePrice,
      purchasePrice: product.purchasePrice,
      profit: product.salePrice - product.purchasePrice,
    });
    setSelectedProducts([...selectedProducts, product]);

    resetProduct();
    form.setValue("items", items);
    calculateAmount();
  }, [product, findProductError, productSelected]);

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
    return product?.name ?? "Error";
  };

  return (
    <div className="flex w-full grow flex-col space-y-4">
      <div className="w-full items-center gap-1.5">
        <Label htmlFor="productId">Código o nombre del producto</Label>
        <Input
          type="text"
          id="productId"
          autoFocus
          value={productCode}
          disabled={isFindingProduct}
          onChange={(e) => setProductCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              setProductSelected(true);
            }
          }}
        />

        <FormDescription>
          Escanea el código de barras del producto o ingresa el código de forma
          manual. Puedes buscar por nombre del producto. Presiona enter para
          agregar el producto a la lista.
        </FormDescription>

        {isFindingProduct && (
          <FormDescription>Buscando producto...</FormDescription>
        )}
      </div>
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
          <div className="flex flex-col">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Resumen
            </h4>
            <p className="text-muted-foreground">
              Productos vendidos:{" "}
              {Intl.NumberFormat("es-CO").format(
                form
                  .watch("items")
                  .reduce((acc, item) => acc + item.quantity, 0),
              )}
            </p>

            <p className="text-muted-foreground">
              Total:{" "}
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(form.watch("amount") ?? 0)}
            </p>
          </div>

          <Button
            type="button"
            disabled={isFindingProduct || !selectedProducts.length}
            onClick={() => onContinue(selectedProducts)}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectProductsStep;
