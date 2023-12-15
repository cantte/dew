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
import { createSaleInput } from "~/server/api/schemas/sales";
import { api } from "~/trpc/react";

type CreateSaleFormValues = z.infer<typeof createSaleInput>;

const CreateSaleForm = () => {
  const form = useForm<CreateSaleFormValues>({
    resolver: zodResolver(createSaleInput),
  });

  const createSale = api.sale.create.useMutation();

  const onSubmit = (data: CreateSaleFormValues) => {
    createSale.mutate(data);
  };

  const customerId = useDebounce(form.watch("customerId"), 1000);
  const {
    data: customer,
    error: findCustomerError,
    isFetching: isFindingCustomer,
  } = api.customer.find.useQuery(
    { id: customerId },
    {
      enabled: customerId !== undefined && customerId !== "",
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
  const [customerSelected, setCustomerSelected] = useState(false);
  const [isOpenCreateCustomerModal, setIsOpenCreateCustomerModal] =
    useState(false);

  const context = api.useUtils();
  useEffect(() => {
    if (isOpenCreateCustomerModal) {
      return;
    }

    void context.customer.find.invalidate();
  }, [isOpenCreateCustomerModal, context]);

  return (
    <Form {...form}>
      <CreateCustomerModal
        open={isOpenCreateCustomerModal}
        id={customerId}
        onOpenChange={setIsOpenCreateCustomerModal}
      />
      <form
        className="flex flex-col space-y-4"
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
            <p className="text-xl text-muted-foreground">En contrucción...</p>
          </>
        )}
      </form>
    </Form>
  );
};

export default CreateSaleForm;
