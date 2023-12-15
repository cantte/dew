"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { createCustomerInput } from "~/server/api/schemas/customers";
import { api } from "~/trpc/react";

type CreateCustomerFormProps = {
  id?: string;
  onCreate: () => void;
};

type CreateCustomerFormValues = z.infer<typeof createCustomerInput>;

const CreateCustomerForm = ({ onCreate, id }: CreateCustomerFormProps) => {
  const form = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(createCustomerInput),
    defaultValues: {
      id,
    },
  });

  const createCustomer = api.customer.create.useMutation();

  useEffect(() => {
    if (createCustomer.isSuccess) {
      form.reset();
      onCreate();
    }
  }, [createCustomer.isSuccess]);

  const onSubmit = (data: CreateCustomerFormValues) => {
    createCustomer.mutate(data);
  };

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
              <FormLabel>Identificación</FormLabel>
              <FormControl>
                <Input required autoFocus {...field} />
              </FormControl>

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
                <Input required {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createCustomer.isLoading}>
          {createCustomer.isLoading && (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          )}
          Crear
        </Button>
      </form>
    </Form>
  );
};

export default CreateCustomerForm;
