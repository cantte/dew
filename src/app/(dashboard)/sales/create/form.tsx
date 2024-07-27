'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus, RotateCw, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { SelectSaleCustomer } from '~/app/(dashboard)/sales/create/select-sale-customer'
import UpdateSalePriceDialog from '~/app/(dashboard)/sales/create/update-sale-price.dialog'
import { PreventNavigation } from '~/components/prevent-navigation'
import { ProductSaleCard } from '~/components/products/sale-card'
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
import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Separator } from '~/components/ui/separator'
import { useToast } from '~/components/ui/use-toast'
import { paymentMethods } from '~/constants'
import type { PaymentMethod } from '~/server/api/schemas/common'
import { createSaleInput } from '~/server/api/schemas/sales'
import { formatToCurrency } from '~/text/format'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

export type FormValues = z.infer<typeof createSaleInput>
export type FormSteps = 'select-products' | 'select-customer' | 'checkout'

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
  products: RouterOutputs['product']['list']
  suggestions: RouterOutputs['product']['suggestions']
}

const CreateSaleForm = ({ store, products, suggestions }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createSaleInput),
    defaultValues: {
      storeId: store.id,
      customerId: '222222222222',
      items: [],
      paymentMethod: 'cash',
      status: 'paid',
      amount: 0,
      payment: 0,
    },
  })

  const createSale = api.sale.create.useMutation()
  const onSubmit = (data: FormValues) => {
    createSale.mutate(data)
  }

  const items = form.watch('items')

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId)

    if (!product) return

    const existingItem = items.find((item) => item.productId === productId)

    if (existingItem) {
      form.setValue(
        'items',
        items.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      )
      return
    }

    form.setValue('items', [
      ...items,
      {
        productId: product.id,
        quantity: 1,
        purchasePrice: product.purchasePrice,
        salePrice: product.salePrice,
        profit: product.salePrice - product.purchasePrice,
      },
    ])
  }

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    return product?.name ?? 'Producto no encontrado'
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: don't needed
  useEffect(() => {
    const amount = items.reduce<number>(
      (acc, item) => acc + item.quantity * item.salePrice,
      0,
    )

    form.setValue('amount', amount)
    form.setValue('payment', amount)
  }, [items])

  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: don't needed
  useEffect(() => {
    if (createSale.isSuccess) {
      toast({
        title: 'Venta creada',
        description: 'La venta se ha creado correctamente',
      })

      form.reset({
        storeId: store.id,
        customerId: '222222222222',
        items: [],
        paymentMethod: 'cash',
        status: 'paid',
        amount: 0,
        payment: 0,
      })
    }
  }, [createSale.isSuccess])

  const prevent = form.formState.isDirty || items.length > 0

  const [productQuery, setProductQuery] = useState('')
  const filteredProducts = products.filter(
    (product) =>
      product.name!.toLowerCase().includes(productQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(productQuery.toLowerCase()),
  )

  const onSelectPaymentMethod = (value: string) => {
    form.setValue('paymentMethod', value as PaymentMethod)
    form.setValue('payment', form.watch('amount'))
  }

  const amount = form.watch('amount')
  const payment = form.watch('payment')

  const increaseQuantity = (index: number) => {
    form.setValue(
      'items',
      items.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    )
  }

  const decreaseQuantity = (index: number) => {
    form.setValue(
      'items',
      items.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity - 1 } : item,
      ),
    )
  }

  const removeProduct = (index: number) => {
    form.setValue(
      'items',
      items.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
      <PreventNavigation
        prevent={prevent}
        backHref="/dashboard"
        reset={form.reset}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grow grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded border p-4 md:col-span-2">
              <div className="grid gap-4">
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

                <span className="font-medium">Sugerencias</span>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                  {suggestions.map((product) => (
                    <ProductSaleCard
                      key={product.id}
                      product={product}
                      onAddProduct={addProduct}
                    />
                  ))}
                </div>

                {productQuery.length > 0 && (
                  <>
                    <span className="font-medium">Productos</span>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
                      {filteredProducts.map((product) => (
                        <ProductSaleCard
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
                  <span className="font-medium">Cliente</span>

                  <SelectSaleCustomer />
                </div>

                <Separator />

                <div className="grid gap-2">
                  <span className="font-medium">Productos</span>

                  <div className="grid gap-2">
                    {form.watch('items').map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 gap-2 rounded border p-2 md:grid-cols-3 md:gap-1"
                      >
                        <div className="grid gap-1">
                          <span>{getProductName(item.productId)}</span>
                          <span className="text-muted-foreground text-xs">
                            {formatToCurrency('es-CO', item.salePrice)}
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
                          <span>
                            {formatToCurrency(
                              'es-CO',
                              item.quantity * item.salePrice,
                            )}
                          </span>

                          <UpdateSalePriceDialog
                            productName={getProductName(item.productId)}
                            index={index}
                          />

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

              <Separator />

              <div className="grid gap-4">
                <div className="grid gap-3 text-sm">
                  <span>Método de pago</span>

                  <Select
                    value={form.watch('paymentMethod')}
                    onValueChange={onSelectPaymentMethod}
                  >
                    <SelectTrigger>
                      <SelectValue defaultValue={form.watch('paymentMethod')} />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {form.watch('paymentMethod') === 'cash' && (
                    <FormField
                      control={form.control}
                      name="payment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pago recibido</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              disabled={createSale.isPending}
                              {...field}
                            />
                          </FormControl>

                          <FormMessage />

                          <FormDescription>
                            Cambio:{' '}
                            {formatToCurrency('es-CO', payment - amount)}
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid gap-3 text-sm">
                  <span>Resumen</span>
                  <ul className="grid gap-1">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Productos vendidos
                      </span>
                      <span>
                        {Intl.NumberFormat('es-CO').format(
                          form
                            .watch('items')
                            .reduce((acc, item) => acc + item.quantity, 0),
                        )}
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span>{formatToCurrency('es-CO', amount ?? 0)}</span>
                    </li>
                  </ul>
                </div>

                <Button type="submit" disabled={createSale.isPending}>
                  {createSale.isPending && (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Finalizar venta
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default CreateSaleForm
