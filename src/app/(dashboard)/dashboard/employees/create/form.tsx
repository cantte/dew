'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useDebounce } from '@uidotdev/usehooks'
import { User } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useToast } from '~/components/ui/use-toast'
import { createEmployeeInput } from '~/server/api/schemas/employees'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
}

type FormValues = z.infer<typeof createEmployeeInput>

const CreateEmployeeForm = ({ store }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createEmployeeInput),
    defaultValues: {
      storeId: store.id,
    },
  })

  const createEmployee = api.employee.create.useMutation()

  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (createEmployee.isSuccess) {
      toast({
        title: 'Empleado creado',
        description: 'El empleado ha sido creado exitosamente.',
      })
    }
  }, [createEmployee.isSuccess])

  const onSubmit = (data: FormValues) => {
    createEmployee.mutate(data)
  }

  const employeeCode = useDebounce(form.watch('code'), 1000)
  const { data: employee } = api.employee.find.useQuery(
    { code: employeeCode ?? '' },
    {
      enabled: employeeCode !== '',
    },
  )

  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    if (employee) {
      setIsOpen(true)
    }
  }, [employee])

  const loadEmployee = () => {
    form.reset({
      code: employeeCode,
      name: employee?.name,
      email: employee?.email,
      phone: employee?.phone !== null ? employee?.phone : undefined,
      storeId: store.id,
    })
    setIsOpen(false)
  }

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

      <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grow grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded border p-4 md:col-span-2">
                <div className="grid gap-4">
                  <div>
                    <p className="font-bold text-lg">Información general</p>
                  </div>

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

                  <div>
                    <p className="font-bold text-lg">Información de contacto</p>
                  </div>

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
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded border p-4">
                <div className="grid gap-4 text-sm">
                  <div>
                    <Badge variant="secondary">{store.name}</Badge>
                  </div>

                  <div className="flex flex-col items-center space-y-2">
                    <User className="size-16 text-muted-foreground" />

                    <p className="text-base">
                      {form.watch('name') || 'Nombre del empleado'}
                    </p>

                    <p className="text-muted-foreground text-sm">
                      {form.watch('code') || 'Identificación del empleado'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium text-muted-foreground text-sm">
                      Email: {form.watch('email') || 'Email del empleado'}
                    </span>

                    <span className="font-medium text-muted-foreground text-sm">
                      Teléfono: {form.watch('phone') || 'Teléfono del empleado'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button type="submit" disabled={createEmployee.isPending}>
                    {createEmployee.isPending && (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Registrar empleado
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Fragment>
  )
}

export default CreateEmployeeForm
