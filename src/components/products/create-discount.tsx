import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { TypeOf } from "zod";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Checkbox } from "~/components/ui/checkbox";
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { createProductDiscountInput } from "~/server/api/schemas/products";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

type Props = {
  product: RouterOutputs["product"]["list"][number];
};

type FormValues = TypeOf<typeof createProductDiscountInput>;

const CreateProductDiscountDialog = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<FormValues>({
    defaultValues: {
      productId: product.id,
      discount: 0,
    },
    resolver: zodResolver(createProductDiscountInput),
  });

  const createProductDiscount = api.product.createDiscount.useMutation();
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    createProductDiscount.mutate(values);
  };

  const { toast } = useToast();
  useEffect(() => {
    if (createProductDiscount.isSuccess) {
      toast({
        title: "Éxito",
        description: "Descuento creado correctamente",
      });

      form.reset();
      setIsOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createProductDiscount.isSuccess]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <span>Agregar descuento</span>
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar descuento</DialogTitle>
          <DialogDescription>
            Añade un descuento al producto <strong>{product.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="isPercentage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>¿Es un descuento en porcentaje?</FormLabel>
                    <FormDescription>
                      Si no, el descuento se aplicará en cantidad
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descuento</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>

                  {form.watch("isPercentage") && (
                    <FormDescription>
                      Ingrese un valor de 0 a 100
                    </FormDescription>
                  )}

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de inicio</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              Intl.DateTimeFormat("es-CO", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }).format(field.value)
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de final</FormLabel>

                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              Intl.DateTimeFormat("es-CO", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }).format(field.value)
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={createProductDiscount.isPending}>
              {createProductDiscount.isPending && (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              )}
              Agregar descuento
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductDiscountDialog;
