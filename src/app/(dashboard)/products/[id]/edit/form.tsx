"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { updateProductInput } from "~/server/api/schemas/products";
import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/shared";

type Props = {
  product: RouterOutputs["product"]["findById"];
};

type FormValues = z.infer<typeof updateProductInput>;

const EditProductForm = ({ product }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      id: product!.id,
      name: product!.name ?? undefined,
      description: product!.description ?? undefined,
      purchasePrice: product!.purchasePrice ?? undefined,
      salePrice: product!.salePrice ?? undefined,
      stock: product!.stock ?? undefined,
    },
    resolver: zodResolver(updateProductInput),
  });
  const updateProduct = api.product.update.useMutation();

  const router = useRouter();
  useEffect(() => {
    if (updateProduct.isSuccess) {
      router.back();
    }
  }, [updateProduct.isSuccess]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateProduct.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea className="resize-none" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <span className="text-gray-500">Precios</span>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de compra</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio de venta</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={updateProduct.isLoading}>
          {updateProduct.isLoading && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Actualizar
        </Button>
      </form>
    </Form>
  );
};

export default EditProductForm;
