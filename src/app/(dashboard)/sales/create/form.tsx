"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import CheckoutStep from "~/app/(dashboard)/sales/create/checkout-step";
import SelectCustomerStep from "~/app/(dashboard)/sales/create/select-customer-step";
import SelectProductsStep from "~/app/(dashboard)/sales/create/select-products-step";
import { Form } from "~/components/ui/form";
import { useToast } from "~/components/ui/use-toast";
import { createSaleInput } from "~/server/api/schemas/sales";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

export type CreateSaleFormValues = z.infer<typeof createSaleInput>;
export type FormSteps = "select-products" | "select-customer" | "checkout";

type Product = RouterOutputs["product"]["findForSale"];
type Customer = RouterOutputs["customer"]["find"];

type Props = {
  storeId: string;
  suggestions: RouterOutputs["product"]["suggestions"];
};

const CreateSaleForm = ({ storeId, suggestions }: Props) => {
  const form = useForm<CreateSaleFormValues>({
    resolver: zodResolver(createSaleInput),
    defaultValues: {
      storeId: storeId,
      items: [],
      paymentMethod: "Cash",
    },
  });
  const createSale = api.sale.create.useMutation();
  const onSubmit = (data: CreateSaleFormValues) => {
    createSale.mutate(data);
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
    if (createSale.isSuccess) {
      toast({
        title: "Venta creada",
        description: "La venta se ha creado correctamente",
      });

      form.reset();
      setSelectedProducts([]);
      goToStep("select-products");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createSale.isSuccess]);

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
                isCreating={createSale.isPending}
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

export default CreateSaleForm;
