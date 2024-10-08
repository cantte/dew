'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCw, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { TypeOf } from 'zod'
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
import { updateEmployeeInput } from '~/server/api/schemas/employees'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  employee: NonNullable<RouterOutputs['employee']['findById']>
  store: NonNullable<RouterOutputs['store']['findCurrent']>
}

type FormValues = TypeOf<typeof updateEmployeeInput>

export const EditEmployeeForm = ({ employee, store }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(updateEmployeeInput),
    defaultValues: {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone ?? undefined,
    },
  })

  const updateEmployee = api.employee.update.useMutation()

  const { toast } = useToast()
  const router = useRouter()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (updateEmployee.isSuccess) {
      toast({
        title: 'Empleado actualizado',
        description: 'El empleado ha sido actualizado exitosamente.',
      })

      router.refresh()
    }
  }, [updateEmployee.isSuccess])

  const onSubmit = (values: FormValues) => {
    updateEmployee.mutate(values)
  }

  return (
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

                  {employee.code && (
                    <p className="text-muted-foreground text-sm">
                      {employee.code}
                    </p>
                  )}
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
                <Button type="submit" disabled={updateEmployee.isPending}>
                  {updateEmployee.isPending && (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Actualizar empleado
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
