import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import type { Product } from '~/app/(dashboard)/dashboard/products/columns'
import MultiSelectStore from '~/components/stores/multi-select-store'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Badge } from '~/components/ui/badge'
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
import { Form, FormField, FormItem, FormMessage } from '~/components/ui/form'
import { useToast } from '~/components/ui/use-toast'
import { linkToStoresInput } from '~/server/api/schemas/products'
import { api } from '~/trpc/react'

type Props = {
  product: Product
}

type FormValues = z.infer<typeof linkToStoresInput>

const LinkToStoresModal = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      id: product.id,
    },
    resolver: zodResolver(linkToStoresInput),
  })

  const linkToStores = api.product.linkToStores.useMutation()
  const onSubmit = (values: FormValues) => {
    linkToStores.mutate(values)
  }

  const utils = api.useUtils()
  const { toast } = useToast()
  useEffect(() => {
    if (linkToStores.isSuccess) {
      toast({
        title: 'Éxito',
        description: 'El producto ha sido agregado a las tiendas',
      })

      void utils.product.list.invalidate()
      setIsOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkToStores.isSuccess])

  const { data: stores } = api.store.list.useQuery()

  const selectedStores = form.watch('stores', [])
  const setSelectedStores = (value: Array<string>) =>
    form.setValue('stores', value)
  const { data: productStores } = api.product.stores.useQuery({
    id: product.id,
  })

  useEffect(() => {
    if (!productStores) {
      return
    }

    setSelectedStores(productStores.map((store) => store.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productStores])

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
            Selecciona las tiendas a las que quieres agregar el producto{' '}
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
                    {stores && (
                      <MultiSelectStore
                        stores={stores}
                        selectedStores={selectedStores}
                        onSelectedChange={setSelectedStores}
                      />
                    )}

                    <div className="mt-1.5 flex flex-row items-center justify-between">
                      {selectedStores.length > 0 && (
                        <div>
                          <span className="text-xs text-gray-500">
                            Tiendas seleccionadas
                          </span>
                          <ul className="mt-1 flex flex-row space-x-2">
                            {selectedStores.map((store) => (
                              <Badge variant="outline" key={store}>
                                {stores?.find((s) => s.id === store)?.name}
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

            <Button type="submit" disabled={linkToStores.isPending}>
              {linkToStores.isPending && (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              )}
              Agregar a tiendas
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default LinkToStoresModal
