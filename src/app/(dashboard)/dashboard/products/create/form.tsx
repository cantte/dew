'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useDebounce } from '@uidotdev/usehooks'
import { Tag } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import type { z } from 'zod'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

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
import { Textarea } from '~/components/ui/textarea'
import { useToast } from '~/components/ui/use-toast'
import { createProductInput } from '~/server/api/schemas/products'
import { formatToCurrency } from '~/text/format'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
}

type FormValues = z.infer<typeof createProductInput>

export const CreateProductForm = ({ store }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createProductInput),
    defaultValues: {
      code: '',
      name: '',
      storeId: store.id,
      stock: 0,
      quantity: 0,
    },
  })

  const resetForm = () => {
    form.reset({
      code: '',
      name: '',
      description: '',
      purchasePrice: 0,
      salePrice: 0,
      stock: 0,
      quantity: 0,
      storeId: store.id,
    })
  }

  const createProduct = api.product.create.useMutation()

  const { toast } = useToast()
  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (createProduct.isSuccess) {
      toast({
        title: 'Éxito',
        description: 'El producto se creó con éxito.',
      })

      resetForm()
    }
  }, [createProduct.isSuccess])

  const onSubmit = (data: FormValues) => {
    createProduct.mutate(data)
  }

  const code = useDebounce(form.watch('code'), 1000)
  const { data: exists, error } = api.product.exists.useQuery(
    { code: code },
    {
      enabled: code !== '' && code !== undefined,
    },
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (error) {
      if (error.message.includes('undefined')) {
        form.clearErrors('code')
        return
      }
    }

    if (exists !== undefined && exists.code === code) {
      form.setError('code', {
        type: 'manual',
        message: 'El código ya existe',
      })
    }
  }, [exists, error])

  const salePrice = form.watch('salePrice')
  const purchasePrice = form.watch('purchasePrice')

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
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input type="text" autoFocus {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea className="resize-none" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código de barras</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <p className="font-bold text-lg">Precios</p>
                </div>

                <div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="purchasePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio de compra</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="salePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio de venta</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <p className="font-bold text-lg">Inventario</p>
                  <span className="text-muted-foreground text-sm">
                    No se llevará un control de inventario si el stock es 0.
                  </span>
                </div>

                <div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>

                          <FormDescription>
                            Recibirás una notificación cuando la cantidad de
                            productos sea menor al stock.
                          </FormDescription>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded border p-4">
              <div className="grid gap-4 text-sm">
                <div>
                  <Badge variant="secondary">{store.name}</Badge>
                </div>

                <div className="flex flex-col items-center space-y-2">
                  <Tag className="size-16 text-muted-foreground" />

                  <p className="text-base">
                    {form.watch('name') || 'Nombre del producto'}
                  </p>

                  <p className="text-muted-foreground text-sm">
                    {formatToCurrency('es-CO', form.watch('salePrice') ?? 0)}
                  </p>
                </div>

                <div>
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Referencia</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} />
                        </FormControl>

                        <FormDescription>
                          Código unico para indentificar tus productos
                        </FormDescription>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {salePrice > 0 && purchasePrice > 0 && (
                  <div>
                    <span className="font-medium text-muted-foreground text-sm">
                      Ganancia aproximada por unidad:{' '}
                      {formatToCurrency('es-CO', salePrice - purchasePrice)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col space-y-2">
                <Button type="submit" disabled={createProduct.isPending}>
                  {createProduct.isPending && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Agregar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
