"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  MinusIcon,
  PlusIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import CreateCustomerModal from "~/components/customers/create-customer.modal";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useToast } from "~/components/ui/use-toast";
import { createSaleInput } from "~/server/api/schemas/sales";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

export type CreateSaleFormValues = z.infer<typeof createSaleInput>;
type Product = RouterOutputs["product"]["find"];

type Props = {
  storeId: string;
};

const CreateSaleForm = ({ storeId }: Props) => {
  const form = useForm<CreateSaleFormValues>({
    resolver: zodResolver(createSaleInput),
    defaultValues: {
      storeId: storeId,
      items: [],
    },
  });

  const calculateAmount = () => {
    const items = form.getValues("items");
    const amount = items.reduce(
      (acc, item) => acc + item.quantity * item.salePrice,
      0,
    );
    form.setValue("amount", amount);
    form.setValue("payment", amount);
  };

  const createSale = api.sale.create.useMutation();
  const onSubmit = (data: CreateSaleFormValues) => {
    createSale.mutate(data);
  };

  const customerId = useDebounce(form.watch("customerId"), 1000);
  const [customerSelected, setCustomerSelected] = useState(false);
  const {
    data: customer,
    error: findCustomerError,
    isFetching: isFindingCustomer,
  } = api.customer.find.useQuery(
    { id: customerId },
    {
      enabled:
        customerId !== undefined && customerId !== "" && !customerSelected,
    },
  );

  useEffect(() => {
    if (findCustomerError) {
      if (findCustomerError.message.includes("undefined")) {
        form.setError("customerId", {
          type: "manual",
          message: "El cliente no existe",
        });
        return;
      }
    }

    if (customer) {
      form.setValue("customerId", customer.id);
      form.clearErrors("customerId");
    }
  }, [customer, findCustomerError]);
  const [isOpenCreateCustomerModal, setIsOpenCreateCustomerModal] =
    useState(false);

  const context = api.useUtils();
  useEffect(() => {
    if (isOpenCreateCustomerModal) {
      return;
    }

    void context.customer.find.invalidate();
  }, [isOpenCreateCustomerModal, context]);

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
  } = api.product.find.useQuery(
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
      product !== undefined && productSelected && product.quantity > 0;

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

  const { toast } = useToast();
  useEffect(() => {
    if (createSale.isSuccess) {
      toast({
        title: "Venta creada",
        description: "La venta se ha creado correctamente",
      });

      form.reset();
      resetProduct();
      setCustomerSelected(false);
    }
  }, [createSale.isSuccess]);

  const getProductName = (productId: string) => {
    const product = selectedProducts.find((p) => p?.id === productId);
    return product?.name ?? "Error";
  };

  return (
    <Form {...form}>
      <CreateCustomerModal
        open={isOpenCreateCustomerModal}
        id={customerId}
        onOpenChange={setIsOpenCreateCustomerModal}
      />
      <form
        className="flex min-h-[calc(100vh-20rem)] flex-col space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {!customerSelected && (
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identificación cliente</FormLabel>
                <FormControl>
                  <Input autoFocus disabled={isFindingCustomer} {...field} />
                </FormControl>

                {isFindingCustomer && (
                  <FormDescription>Buscando cliente...</FormDescription>
                )}

                {customer && (
                  <>
                    <FormDescription>{customer.name}</FormDescription>
                    <Button onClick={() => setCustomerSelected(true)}>
                      Continuar
                    </Button>
                  </>
                )}

                <FormMessage />

                {findCustomerError &&
                  findCustomerError.message.includes("undefined") && (
                    <Button
                      onClick={() => setIsOpenCreateCustomerModal(true)}
                      variant="outline"
                    >
                      Crear cliente
                    </Button>
                  )}
              </FormItem>
            )}
          />
        )}

        {customerSelected && (
          <>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="productId">Código del producto</Label>
              <Input
                type="text"
                id="productId"
                autoFocus
                value={productCode}
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
                Escanea el código de barras del producto o ingresa el código de
                forma manual y presiona enter
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
                <div>
                  <div className="flex flex-col">
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                      Cliente
                    </h4>
                    <p className="text-muted-foreground">{customer?.name}</p>
                  </div>

                  <Separator className="my-4" />

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
                      }).format(form.watch("amount"))}
                    </p>
                  </div>
                </div>

                <Button type="submit" disabled={createSale.isLoading}>
                  {createSale.isLoading && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Crear venta
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </Form>
  );
};

export default CreateSaleForm;
