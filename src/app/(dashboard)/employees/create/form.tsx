"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
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
import { useToast } from "~/components/ui/use-toast";
import { createEmployeeInput } from "~/server/api/schemas/employees";
import { api } from "~/trpc/react";

type Props = {
  storeId: string;
};

type FormValues = z.infer<typeof createEmployeeInput>;

const CreateEmployeeForm = ({ storeId }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      storeId,
    },
    resolver: zodResolver(createEmployeeInput),
  });

  const createEmployee = api.employee.create.useMutation();
  const { toast } = useToast();
  const route = useRouter();
  useEffect(() => {
    if (createEmployee.isSuccess) {
      toast({
        title: "Empleado creado",
        description: "El empleado ha sido creado exitosamente.",
      });
      route.push("/dashboard/employees");
    }
  }, [createEmployee.isSuccess]);

  const onSubmit = (data: FormValues) => {
    createEmployee.mutate(data);
  };

  const employeeId = useDebounce(form.watch("id"), 1000);
  const { data: employee } = api.employee.find.useQuery(
    { id: employeeId },
    {
      enabled: employeeId !== "",
    },
  );

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (employee) {
      setIsOpen(true);
    }
  }, [employee]);

  return (
    <Fragment>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Empleado encontrado</AlertDialogTitle>
            <AlertDialogDescription>
              Ya existe un empleado con la identificación ingresada. ¿Desea
              cargar los datos del empleado?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              autoFocus
              onClick={() => form.reset(employee as FormValues)}
            >
              Cargar datos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
                  <Input autoFocus {...field} />
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
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <Input type="email" {...field} />
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

          <Button type="submit" disabled={createEmployee.isPending}>
            {createEmployee.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Crear
          </Button>
        </form>
      </Form>
    </Fragment>
  );
};

export default CreateEmployeeForm;
