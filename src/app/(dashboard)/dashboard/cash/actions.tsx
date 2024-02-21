"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { createCashRegisterTransactionInput } from "~/server/api/schemas/cashRegisters";
import { api } from "~/trpc/react";

type Props = {
  cashRegisterId: string;
};

type FormValues = z.infer<typeof createCashRegisterTransactionInput>;

const CashRegisterActions = ({ cashRegisterId }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      cashRegisterId: cashRegisterId,
    },
    resolver: zodResolver(createCashRegisterTransactionInput),
  });

  const createCashRegisterTransaction =
    api.cashRegister.transactions.create.useMutation();
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    createCashRegisterTransaction.mutate(values);
  };

  const [open, setOpen] = useState(false);

  const router = useRouter();
  const utils = api.useUtils();
  useEffect(() => {
    if (createCashRegisterTransaction.isSuccess) {
      setOpen(false);
      router.refresh();
      void utils.cashRegister.transactions.list.invalidate();
      form.reset();
    }
  }, [createCashRegisterTransaction.isSuccess]);

  useEffect(() => {
    if (createCashRegisterTransaction.error) {
      form.setError("amount", {
        type: "manual",
        message: createCashRegisterTransaction.error.message,
      });
    }
  }, [createCashRegisterTransaction.error]);

  const inTransaction = () => {
    setOpen(true);
    form.setValue("type", "IN");
  };

  const outTransaction = () => {
    setOpen(true);
    form.setValue("type", "OUT");
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className="flex justify-between">
      <Button size="sm" className="text-sm" onClick={inTransaction}>
        Realizar ingreso
      </Button>
      <Button
        size="sm"
        className="text-sm"
        variant="outline"
        onClick={outTransaction}
      >
        Realizar egreso
      </Button>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {form.watch("type") === "IN" ? "Ingreso" : "Egreso"}
              </DialogTitle>
              <DialogDescription>
                {form.watch("type") === "IN"
                  ? "Registra un ingreso en la caja."
                  : "Registra un egreso en la caja."}
              </DialogDescription>
            </DialogHeader>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={createCashRegisterTransaction.isLoading}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={createCashRegisterTransaction.isLoading}
                  >
                    {createCashRegisterTransaction.isLoading && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Realizar transacción
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>
                {form.watch("type") === "IN" ? "Ingreso" : "Egreso"}
              </DrawerTitle>
              <DrawerDescription>
                {form.watch("type") === "IN"
                  ? "Registra un ingreso en la caja."
                  : "Registra un egreso en la caja."}
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={createCashRegisterTransaction.isLoading}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createCashRegisterTransaction.isLoading}
                  >
                    {createCashRegisterTransaction.isLoading && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Realizar transacción
                  </Button>
                </form>
              </Form>
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

export default CashRegisterActions;
