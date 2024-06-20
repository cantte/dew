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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createEmployee.isSuccess]);

  const onSubmit = (data: FormValues) => {
    createEmployee.mutate(data);
  };

  const employeeCode = useDebounce(form.watch("code"), 1000);
  const { data: employee } = api.employee.find.useQuery(
    { code: employeeCode ?? "" },
    {
      enabled: employeeCode !== "",
    },
  );

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (employee) {
      setIsOpen(true);
    }
  }, [employee]);

  const loadEmployee = () => {
    form.reset({
      code: employeeCode,
      name: employee?.name,
      email: employee?.email,
      phone: employee?.phone !== null ? employee?.phone : undefined,
      storeId,
    });
    setIsOpen(false);
  };

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
            <AlertDialogAction autoFocus onClick={loadEmployee}>
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
            name="code"
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
