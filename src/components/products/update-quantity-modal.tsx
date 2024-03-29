import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type z } from "zod";
import { type Product } from "~/app/(dashboard)/dashboard/products/columns";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
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
import { updateProductQuantityInput } from "~/server/api/schemas/products";
import { api } from "~/trpc/react";

type UpdateProductQuantityModalProps = {
  product: Product;
};

type UpdateProductQuantityFormValues = z.infer<
  typeof updateProductQuantityInput
>;

const UpdateProductQuantityModal = ({
  product,
}: UpdateProductQuantityModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<UpdateProductQuantityFormValues>({
    defaultValues: {
      id: product.id,
    },
    resolver: zodResolver(updateProductQuantityInput),
  });

  const updateProductQuantity = api.product.updateQuantity.useMutation();
  const onSubmit: SubmitHandler<UpdateProductQuantityFormValues> = (values) => {
    updateProductQuantity.mutate(values);
  };

  const productListKey = api.product.list.getQueryKey();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (updateProductQuantity.isSuccess) {
      void queryClient.invalidateQueries(productListKey);
      setIsOpen(false);
    }
  }, [updateProductQuantity.isSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Modificar existencia
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modificar existencia</DialogTitle>
          <DialogDescription>
            Modificar la existencia del producto <strong>{product.name}</strong>
            {updateProductQuantity.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Ha ocurrido un error</AlertTitle>
                <AlertDescription>
                  {updateProductQuantity.error.message}
                </AlertDescription>
              </Alert>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <Input autoFocus {...field} />
                  </FormControl>

                  <FormDescription>
                    Digite la cantidad a agregar o restar de la existencia
                    actual del producto.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-grow flex-row justify-between space-x-4">
              <Button
                type="submit"
                className="grow"
                onClick={() => form.setValue("operation", "remove")}
              >
                Restar
              </Button>
              <Button
                type="submit"
                className="grow"
                onClick={() => form.setValue("operation", "add")}
              >
                Agregar
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductQuantityModal;
