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
import { createStoreInput } from "~/server/api/schemas/stores";
import { api } from "~/trpc/react";

export type CreateStoreFormProps = z.infer<typeof createStoreInput>;

const CreateStoreForm = () => {
  const form = useForm<CreateStoreFormProps>({
    resolver: zodResolver(createStoreInput),
  });

  const createStore = api.store.create.useMutation();
  const onSubmit: SubmitHandler<CreateStoreFormProps> = (data) => {
    createStore.mutate(data);
  };

  const router = useRouter();
  useEffect(() => {
    if (createStore.isSuccess) {
      router.refresh();
    }
  }, [createStore.isSuccess, router]);

  return (
    <Form {...form}>
      <form
        className="flex min-h-[calc(100vh-20rem)] flex-col space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input autoFocus disabled={createStore.isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input disabled={createStore.isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input disabled={createStore.isLoading} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createStore.isLoading}>
          {createStore.isLoading && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Crear tienda
        </Button>
      </form>
    </Form>
  );
};

export default CreateStoreForm;
