import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCw, SquarePen } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import type { TypeOf } from 'zod'
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
import { updateStoreInput } from '~/server/api/schemas/stores'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  store: NonNullable<RouterOutputs['store']['list'][number]>
}

type FormValues = TypeOf<typeof updateStoreInput>

const UpdateStoreModal = ({ store }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const form = useForm<FormValues>({
    defaultValues: {
      id: store.id,
      name: store.name,
      address: store.address ?? undefined,
      phone: store.phone ?? undefined,
    },
    resolver: zodResolver(updateStoreInput),
  })

  const updateStore = api.store.update.useMutation()
  const onSubmit: SubmitHandler<FormValues> = (values) => {
    updateStore.mutate(values)
  }

  const utils = api.useUtils()
  const { toast } = useToast()
  useEffect(() => {
    if (updateStore.isSuccess) {
      toast({
        title: 'Éxito',
        description: 'Tienda actualizada correctamente',
      })

      void utils.store.list.invalidate()
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateStore.isSuccess])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="icon">
          <SquarePen className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modificar tienda</DialogTitle>
          <DialogDescription>
            {updateStore.error && (
              <Alert variant="destructive" className="mt-4">
                <AlertTitle>Ha ocurrido un error</AlertTitle>
                <AlertDescription>{updateStore.error.message}</AlertDescription>
              </Alert>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
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

            <Button type="submit" disabled={updateStore.isPending}>
              {updateStore.isPending && (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              )}
              Actualizar tienda
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateStoreModal
