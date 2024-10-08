import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCw } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useToast } from '~/components/ui/use-toast'
import { updateInventoryInput } from '~/server/api/schemas/inventory'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  product: RouterOutputs['product']['list'][number]
}

type FormValues = z.infer<typeof updateInventoryInput>

const UpdateInventoryModal = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<FormValues>({
    defaultValues: {
      id: product.id,
      stock: product.stock,
      quantity: 0,
      operation: 'add',
    },
    resolver: zodResolver(updateInventoryInput),
  })

  const updateProductQuantity = api.inventory.update.useMutation()
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    updateProductQuantity.mutate(values)
  }

  const utils = api.useUtils()
  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (updateProductQuantity.isSuccess) {
      toast({
        title: 'Éxito',
        description: 'Inventario actualizado correctamente',
      })

      utils.product.list.invalidate()
      setIsOpen(false)
    }
  }, [updateProductQuantity.isSuccess])

  const canUpdateInventory = api.rbac.checkPermissions.useQuery({
    permissions: ['inventory:update'],
  })

  return (
    <Fragment>
      {!canUpdateInventory.isPending && canUpdateInventory.data ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <span className="text-sm">Ajustar inventario</span>
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajustar inventario</DialogTitle>
              <DialogDescription>
                Producto <strong>{product.name}</strong>, cantidad actual{' '}
                <strong>{product.quantity}</strong>
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input autoFocus {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="operation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operación</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione la operación a realizar" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="add">Agregar</SelectItem>
                          <SelectItem value="remove">Restar</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormDescription>
                        Seleccione la operación a realizar sobre la existencia
                        del producto.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={updateProductQuantity.isPending}
                >
                  {updateProductQuantity.isPending && (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Ajustar inventario
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      ) : null}
    </Fragment>
  )
}

export default UpdateInventoryModal
