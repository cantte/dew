'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { TypeOf } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { Form } from '~/components/ui/form'
import { useToast } from '~/components/ui/use-toast'
import type { updateProductInput } from '~/server/api/schemas/products'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

import { Check, ChevronsUpDown, RotateCw, Tag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { Switch } from '~/components/ui/switch'
import { Textarea } from '~/components/ui/textarea'
import { cn } from '~/lib/utils'
import { formatToCurrency } from '~/text/format'

type Props = {
  product: NonNullable<RouterOutputs['product']['findById']>
  units: RouterOutputs['product']['units']
}

type FormValues = TypeOf<typeof updateProductInput>

export const EditProductForm = ({ product, units }: Props) => {
  const form = useForm<FormValues>({
    defaultValues: {
      id: product.id,
      reference: product.reference ?? undefined,
      name: product.name,
      description: product.description ?? undefined,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      enabled: product.enabled,
      unitId: product.unitId ?? undefined,
    },
  })

  const updateProduct = api.product.update.useMutation()

  const { toast } = useToast()
  const router = useRouter()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (updateProduct.isSuccess) {
      toast({
        title: 'Producto actualizado',
        description: 'El producto ha sido actualizado exitosamente.',
      })

      router.refresh()
    }
  }, [updateProduct.isSuccess])

  const onSubmit = (data: FormValues) => {
    updateProduct.mutate(data)
  }

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

                <div>
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="unitId"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <div>
                            <FormLabel>Unidad de medida</FormLabel>
                          </div>

                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    'justify-between',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value
                                    ? units.find(
                                        (unit) => unit.id === field.value,
                                      )?.name
                                    : 'Selecciona una unidad'}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>

                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Buscar unidad"
                                  className="h-9"
                                />

                                <CommandList>
                                  <CommandEmpty>
                                    No se encontraron resultados
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {units.map((unit) => (
                                      <CommandItem
                                        key={unit.id}
                                        value={unit.name}
                                        onSelect={() =>
                                          form.setValue('unitId', unit.id)
                                        }
                                      >
                                        {unit.name}
                                        <Check
                                          className={cn(
                                            'ml-auto h-4 w-4',
                                            unit.id === field.value
                                              ? 'opacity-100'
                                              : 'opacity-0',
                                          )}
                                        />
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

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
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded border p-4">
              <div className="grid gap-4 text-sm">
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

                <div>
                  <FormField
                    control={form.control}
                    name="enabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Activo / Inactivo</FormLabel>
                          <FormDescription>
                            Habilita o deshabilita la visibilidad del producto
                            al realizar ventas.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>

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
                <Button type="submit" disabled={updateProduct.isPending}>
                  {updateProduct.isPending && (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
