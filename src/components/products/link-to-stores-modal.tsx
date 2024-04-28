import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { type Product } from "~/app/(dashboard)/dashboard/products/columns";
import MultiSelectStore from "~/components/stores/multi-select-store";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Badge } from "~/components/ui/badge";
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
import { Form, FormField, FormItem, FormMessage } from "~/components/ui/form";
import { linkToStoresInput } from "~/server/api/schemas/products";
import { api } from "~/trpc/react";
import { RouterOutputs } from "~/trpc/shared";

type Props = {
  product: Product;
};

type FormValues = z.infer<typeof linkToStoresInput>;

const LinkToStoresModal = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      id: product.id,
    },
    resolver: zodResolver(linkToStoresInput),
  });

  const linkToStores = api.product.linkToStores.useMutation();
  const onSubmit = (values: FormValues) => {
    linkToStores.mutate(values);
  };

  const utils = api.useUtils();
  useEffect(() => {
    if (linkToStores.isSuccess) {
      void utils.product.list.invalidate();
      setIsOpen(false);
    }
  }, [linkToStores.isSuccess]);

  const { data: stores } = api.store.list.useQuery();
  const [selectedStores, setSelectedStores] = useState<
    RouterOutputs["store"]["list"]
  >([]);

  useEffect(() => {
    form.setValue(
      "stores",
      selectedStores.map((store) => store.id),
    );
  }, [selectedStores]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Agregar a tiendas
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar a tiendas</DialogTitle>
          <DialogDescription>
            Selecciona las tiendas a las que quieres agregar el producto{" "}
            <strong>{product.name}</strong>
            {linkToStores.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Ha ocurrido un error</AlertTitle>
                <AlertDescription>
                  {linkToStores.error.message}
                </AlertDescription>
              </Alert>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stores"
              render={() => (
                <FormItem>
                  <div>
                    <MultiSelectStore
                      stores={stores}
                      currentStores={selectedStores}
                      onSelectedChange={setSelectedStores}
                    />

                    <div className="mt-1.5 flex flex-row items-center justify-between">
                      {selectedStores.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-500">
                            Tiendas seleccionadas
                          </span>
                          <ul className="mt-1 flex flex-row space-x-2">
                            {selectedStores.map((store) => (
                              <Badge variant="outline" key={store.id}>
                                {store.name}
                              </Badge>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={linkToStores.isLoading}>
              {linkToStores.isLoading && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Agregar a tiendas
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LinkToStoresModal;
