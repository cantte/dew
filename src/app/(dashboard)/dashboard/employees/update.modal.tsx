import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCw, SquarePen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TypeOf } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
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
  employee: NonNullable<RouterOutputs['employee']['byStore'][number]>
}

type FormValues = TypeOf<typeof updateEmployeeInput>

const UpdateEmployeeModal = ({ employee }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone ?? undefined,
    },
    resolver: zodResolver(updateEmployeeInput),
  })

  const updateEmployee = api.employee.update.useMutation()
  const onSubmit = (values: FormValues) => {
    updateEmployee.mutate(values)
  }

  const [isOpen, setIsOpen] = useState(false)

  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (updateEmployee.isSuccess) {
      toast({
        title: 'Éxito',
        description: 'Empleado actualizado correctamente',
      })

      router.refresh()
      void utils.employee.byStore.invalidate()

      setIsOpen(false)
    }
  }, [updateEmployee.isSuccess])

  const canUpdateEmployee = api.rbac.checkPermissions.useQuery({
    permissions: ['employee:update'],
  })

  return (
    <>
      {!canUpdateEmployee.isLoading && canUpdateEmployee.data && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button variant="secondary" size="icon">
              <SquarePen className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar empleado</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
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
                      <FormLabel>Correo</FormLabel>
                      <FormControl>
                        <Input {...field} />
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

                <Button type="submit" disabled={updateEmployee.isPending}>
                  {updateEmployee.isPending && (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Actualizar empleado
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default UpdateEmployeeModal
