"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";

import { type z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { createProductInput } from "~/server/api/schemas/products";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";

type CreateProductFormValues = z.infer<typeof createProductInput>;

const CreateProductForm = () => {
  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductInput),
  });

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      form.reset();
    },
  });

  const onSubmit = (data: CreateProductFormValues) => {
    createProduct.mutate(data);
  };

  const id = useDebounce(form.watch("id"), 1000);
  const { data: exists, error } = api.product.exists.useQuery(
    { id: id },
    {
      enabled: id !== "",
    },
  );

  useEffect(() => {
    if (error) {
      if (error.message.includes("undefined")) {
        form.clearErrors("id");
        return;
      }
    }

    if (exists !== undefined && exists.id === id) {
      form.setError("id", {
        type: "manual",
        message: "El código ya existe",
      });
    }
  }, [exists, error]);

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input autoFocus {...field} />
              </FormControl>

              <FormDescription>
                Puedes usar el código de barras del producto. Escanéalo con un
                lector de códigos de barras.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Existencia</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createProduct.isLoading}>
          {createProduct.isLoading && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Crear
        </Button>
      </form>
    </Form>
  );
};

export default CreateProductForm;
