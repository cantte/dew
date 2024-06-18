import { useDebounce } from "@uidotdev/usehooks";
import { BadgePercent, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { TypeOf } from "zod";
import FindProduct from "~/app/(dashboard)/sales/create/find-product";
import UpdateSalePriceDialog from "~/app/(dashboard)/sales/create/update-sale-price.dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { createSaleInput } from "~/server/api/schemas/sales";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

export type FormValues = TypeOf<typeof createSaleInput>;
type Product = RouterOutputs["product"]["findForSale"];

type Props = {
  suggestions: RouterOutputs["product"]["suggestions"];

  onContinue: (selectedProducts: Product[]) => void;
};

const SelectProductsStep = ({ onContinue, suggestions }: Props) => {
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
      salePrice: product.finalPrice,
      purchasePrice: product.purchasePrice,
      profit: product.salePrice - product.purchasePrice,
    });
    setSelectedProducts([...selectedProducts, product]);

    resetProduct();
    form.setValue("items", items);
    calculateAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const hasDiscounts = (productId: string) => {
    const product = selectedProducts.find((p) => p?.id === productId);

    if (!product) {
      return false;
    }

    return product.discounts.length > 0;
  };

  const onSelectProduct = (productCode: string) => {
    setProductCode(productCode);
    setProductSelected(true);
  };

  return (
    <div className="flex w-full grow flex-col space-y-4">
      <div className="space-y-2">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="productId">Código del producto</Label>

          <div className="flex space-x-2">
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

            <FindProduct suggestions={suggestions} onSelect={onSelectProduct} />
          </div>

          <FormDescription>
            Escanea el código de barras del producto o ingresa el código de
            forma manual. Presiona enter para agregar el producto a la lista.
          </FormDescription>

          <FormDescription>
            Presiona{" "}
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">Ctrl +</span>K
            </kbd>{" "}
            para buscar un producto.
          </FormDescription>

          {isFindingProduct && (
            <FormDescription>Buscando producto...</FormDescription>
          )}
        </div>
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
                  <TableCell>
                    <div className="flex flex-row items-center space-x-2">
                      <span>{getProductName(item.productId)}</span>
                      {hasDiscounts(item.productId) && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <BadgePercent className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Este producto tiene descuentos aplicados
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
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
                        calculateAmount();
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
            </div>
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
