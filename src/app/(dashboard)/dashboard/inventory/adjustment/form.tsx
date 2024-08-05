'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus, RotateCw, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { TypeOf } from 'zod'
import { ProductSaleCard } from '~/components/products/sale-card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Form, FormDescription } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useToast } from '~/components/ui/use-toast'
import {
  InventoryAdjustmentType,
  makeInventoryAdjustmentInput as makeInventoryAdjustmentApiInput,
} from '~/server/api/schemas/inventory'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
  products: NonNullable<RouterOutputs['product']['list']>
}

const makeInventoryAdjustmentInput = makeInventoryAdjustmentApiInput.omit({
  userId: true,
})

type FormValues = TypeOf<typeof makeInventoryAdjustmentInput>

export const InventoryAdjustmentForm = ({ store, products }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(makeInventoryAdjustmentInput),
    defaultValues: {
      storeId: store.id,
      products: [],
    },
  })

  const makeInventoryAdjustment = api.inventory.makeAdjustment.useMutation()

  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (makeInventoryAdjustment.isSuccess) {
      toast({
        title: 'Éxito',
        description: 'Ajuste de inventario realizado con éxito',
      })

      form.reset({
        storeId: store.id,
        products: [],
      })
    }
  }, [makeInventoryAdjustment.isSuccess])

  const onSubmit = (data: FormValues) => {
    makeInventoryAdjustment.mutate(data)
  }

  const [productQuery, setProductQuery] = useState('')
  const [adjustmentType, setAdjustmentType] = useState<InventoryAdjustmentType>(
    InventoryAdjustmentType.In,
  )
  const [amount, setAmount] = useState(1)

  const filteredProducts = products.filter(
    (product) =>
      product.name!.toLowerCase().includes(productQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(productQuery.toLowerCase()),
  )

  const items = form.watch('products')

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId)

    if (!product) return

    const existingProduct = items.find((p) => p.productId === productId)

    if (existingProduct) return // Do nothing

    form.setValue('products', [
      ...items,
      {
        productId: product.id,
        quantity: amount,
        type: adjustmentType,
      },
    ])

    setAmount(1)
  }

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product?.name ?? 'Producto no encontrado'
  }

  const increaseQuantity = (index: number) => {
    const currentItem = items[index]

    if (!currentItem) return

    form.setValue(`products.${index}.quantity`, currentItem.quantity + 1)
  }

  const decreaseQuantity = (index: number) => {
    const currentItem = items[index]

    if (!currentItem) return

    form.setValue(`products.${index}.quantity`, currentItem.quantity - 1)
  }

  const removeProduct = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)

    if (newItems.length === 0) {
      form.setValue('products', [])
    }

    form.setValue('products', newItems)
  }

  return (
    <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grow grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded border p-4 md:col-span-2">
              <div className="grid gap-4">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="product-query">Operación</Label>
                    <Select
                      value={adjustmentType}
                      onValueChange={(e) =>
                        setAdjustmentType(e as InventoryAdjustmentType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={InventoryAdjustmentType.In}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={InventoryAdjustmentType.In}>
                          Entrada
                        </SelectItem>
                        <SelectItem value={InventoryAdjustmentType.Out}>
                          Salida
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="amount">Cantidad</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                  </div>

                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="product-query">Buscar producto</Label>
                    <Input
                      id="product-query"
                      onChange={(e) => setProductQuery(e.target.value)}
                    />

                    <FormDescription>
                      Busca productos por código o nombre
                    </FormDescription>
                  </div>
                </div>

                {productQuery.length > 0 && (
                  <>
                    <span className="font-medium">Productos</span>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                      {filteredProducts.map((product) => (
                        <ProductSaleCard
                          key={product.id}
                          product={product}
                          onAddProduct={addProduct}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded border p-4">
              <div className="grid gap-4 text-sm">
                <div>
                  <Badge variant="secondary">{store.name}</Badge>
                </div>

                <div className="grid gap-2">
                  <span className="font-semibold">Productos</span>

                  <div className="grid gap-2">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 gap-2 rounded border p-2 md:grid-cols-3 md:gap-1"
                      >
                        <div className="grid gap-1">
                          <span>{getProductName(item.productId)}</span>
                          <span className="text-muted-foreground text-xs">
                            {item.type === InventoryAdjustmentType.In
                              ? 'Entrada'
                              : 'Salida'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 md:justify-center">
                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="h-7"
                            disabled={item.quantity === 1}
                            onClick={() => decreaseQuantity(index)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>

                          <span className="font-semibold">{item.quantity}</span>

                          <Button
                            type="button"
                            size="icon"
                            variant="secondary"
                            className="h-7"
                            onClick={() => increaseQuantity(index)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 md:justify-end">
                          <Button
                            type="button"
                            size="icon"
                            variant="destructive"
                            className="h-7 w-7"
                            onClick={() => removeProduct(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-3 text-sm">
                <Button
                  type="submit"
                  disabled={makeInventoryAdjustment.isPending}
                >
                  {makeInventoryAdjustment.isPending && (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Realizar ajuste
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
