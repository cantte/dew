"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { createSaleInput } from "~/server/api/schemas/sales";
import { api } from "~/trpc/react";

type CreateSaleFormValues = z.infer<typeof createSaleInput>;

const CreateSaleForm = () => {
  const form = useForm<CreateSaleFormValues>({
    resolver: zodResolver(createSaleInput),
    defaultValues: {
      items: [],
    },
  });

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

  const [productId, setProductId] = useState("");
  const finalProductId = useDebounce(productId, 1000);
  const [productSelected, setProductSelected] = useState(false);

  const resetProduct = () => {
    setProductId("");
    setProductSelected(false);
  };

  const {
    data: product,
    error: findProductError,
    isFetching: isFindingProduct,
  } = api.product.find.useQuery(
    { id: finalProductId },
    {
      enabled:
        finalProductId !== undefined &&
        finalProductId !== "" &&
        productSelected,
    },
  );

  useEffect(() => {
    if (findProductError) {
      if (findProductError.message.includes("undefined")) {
        return;
      }
    }

    if (product && productSelected) {
      const items = form.getValues("items");

      const exists = items.find((item) => item.productId === product.id);
      if (exists) {
        exists.quantity += 1;
        resetProduct();
        return;
      }

      items.push({
        productId: product.id,
        quantity: 1,
        salePrice: product.salePrice,
        purchasePrice: product.purchasePrice,
        profit: product.salePrice - product.purchasePrice,
      });

      resetProduct();
      form.setValue("items", items);
    }
  }, [product, findProductError, productSelected]);

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
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
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
                <ScrollArea>
                  {form.watch("items").map((item, index) => (
                    <div
                      key={item.productId}
                      className="mb-2 flex items-center justify-between space-x-4"
                    >
                      <span>{item.productId}</span>
                      <span>{item.quantity}</span>
                      <span>{item.salePrice}</span>
                      <span>{item.purchasePrice}</span>
                      <span>{item.profit}</span>
                      <span>{item.salePrice * item.quantity}</span>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => {
                          const items = form.getValues("items");
                          items.splice(index, 1);
                          form.setValue("items", items);
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  ))}
                </ScrollArea>
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
                      {form
                        .watch("items")
                        .reduce((acc, item) => acc + item.quantity, 0)}
                    </p>

                    <p className="text-muted-foreground">
                      Total:{" $"}
                      {form
                        .watch("items")
                        .reduce(
                          (acc, item) => acc + item.salePrice * item.quantity,
                          0,
                        )}
                    </p>
                  </div>
                </div>

                <Button type="button" disabled>
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
