"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { TypeOf } from "zod";
import CheckoutStep from "~/app/(dashboard)/orders/create/checkout-step";
import SelectCustomerStep from "~/app/(dashboard)/sales/create/select-customer-step";
import SelectProductsStep from "~/app/(dashboard)/sales/create/select-products-step";
import { Form } from "~/components/ui/form";
import { useToast } from "~/components/ui/use-toast";
import { createOrderInput } from "~/server/api/schemas/orders";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

export type CreateOrderFormValues = TypeOf<typeof createOrderInput>;
export type FormSteps = "select-products" | "select-customer" | "checkout";

type Product = RouterOutputs["product"]["findForSale"];
type Customer = RouterOutputs["customer"]["find"];

type Props = {
  storeId: string;
  suggestions: RouterOutputs["product"]["suggestions"];
};

const CreateOrderForm = ({ storeId, suggestions }: Props) => {
  const form = useForm<CreateOrderFormValues>({
    resolver: zodResolver(createOrderInput),
    defaultValues: {
      storeId: storeId,
      items: [],
      paymentMethod: "Cash",
    },
  });

  const createOrder = api.order.create.useMutation();
  const onSubmit = (data: CreateOrderFormValues) => {
    createOrder.mutate(data);
  };

  const [step, setStep] = useState<FormSteps>("select-products");
  const goToStep = (step: FormSteps) => {
    setStep(step);
  };

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const handleFinishSelectProducts = (selectedProducts: Product[]) => {
    setSelectedProducts(selectedProducts);
    goToStep("select-customer");
  };

  const [selectedCustomer, setSelectedCustomer] = useState<
    Customer | undefined
  >();
  const handleFinishSelectCustomer = (customer?: Customer) => {
    setSelectedCustomer(customer);
    goToStep("checkout");
  };

  const { toast } = useToast();
  useEffect(() => {
    if (createOrder.isSuccess) {
      toast({
        title: "Orden creada",
        description: "La orden se ha creado correctamente",
      });

      form.reset();
      setSelectedProducts([]);
      goToStep("select-products");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createOrder.isSuccess]);

  return (
    <Form {...form}>
      <form
        className="flex min-h-[calc(100vh-20rem)] flex-col space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {
          {
            "select-products": (
              <SelectProductsStep
                onContinue={handleFinishSelectProducts}
                suggestions={suggestions}
              />
            ),
            "select-customer": (
              <SelectCustomerStep onContinue={handleFinishSelectCustomer} />
            ),
            checkout: (
              <CheckoutStep
                isCreating={createOrder.isPending}
                selectedProducts={selectedProducts}
                customer={selectedCustomer}
              />
            ),
          }[step]
        }
      </form>
    </Form>
  );
};

export default CreateOrderForm;
