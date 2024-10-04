'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCw } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { SelectSaleCustomer } from '~/app/(dashboard)/sales/create/select-sale-customer'
import { PreventNavigation } from '~/components/prevent-navigation'
import { ProductSaleCard } from '~/components/products/sale-card'
import { SaleItems } from '~/components/sales/sale-items'
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

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
  employees: RouterOutputs['employee']['byStore']

  products: RouterOutputs['product']['list']
  suggestions: RouterOutputs['product']['suggestions']
}

const CreateSaleForm = ({ store, products, suggestions, employees }: Props) => {
  const ownerId = employees.find((employee) => employee.isOwner)?.id

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
      employeeId: ownerId ?? '',
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
        employeeId: ownerId ?? '',
      })
    }
  }, [createSale.isSuccess])

  const prevent = form.formState.isDirty || items.length > 0

  const [productQuery, setProductQuery] = useState('')
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(productQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(productQuery.toLowerCase()),
  )

  const onSelectPaymentMethod = (value: string) => {
    form.setValue('paymentMethod', value as PaymentMethod)
    form.setValue('payment', form.watch('amount'))
  }

  const onSelectEmployee = (value: string) => {
    form.setValue('employeeId', value)
  }

  const amount = form.watch('amount')
  const payment = form.watch('payment')

  return (
    <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col space-y-4">
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

                {productQuery.length === 0 && (
                  <Fragment>
                    <span className="font-medium">Sugerencias</span>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                      {suggestions.map((product) => (
                        <ProductSaleCard
                          key={product.id}
                          product={product}
                          onAddProduct={addProduct}
                        />
                      ))}
                    </div>
                  </Fragment>
                )}

                {productQuery.length > 0 && (
                  <Fragment>
                    <span className="font-medium">Productos</span>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                      {filteredProducts.map((product) => (
                        <ProductSaleCard
                          product={product}
                          onAddProduct={addProduct}
                        />
                      ))}
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 rounded border p-4">
              <div className="grid gap-4 text-sm">
                <div>
                  <Badge>{store.name}</Badge>
                </div>

                <div className="grid gap-2">
                  <span className="font-semibold leading-none">Vendedor</span>

                  <Select
                    value={form.watch('employeeId')}
                    onValueChange={onSelectEmployee}
                  >
                    <SelectTrigger>
                      <SelectValue defaultValue={form.watch('employeeId')} />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}{' '}
                          {employee.code && `(${employee.code})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <span className="font-semibold leading-none">Cliente</span>

                  <SelectSaleCustomer />
                </div>

                <Separator />

                <div className="grid gap-2">
                  <span className="font-semibold leading-none">Productos</span>

                  <SaleItems products={products} />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4">
                <div className="grid gap-3 text-sm">
                  <span className="font-semibold leading-none">
                    Método de pago
                  </span>

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

                <Separator />

                <div className="grid gap-3 text-sm">
                  <span className="font-semibold leading-none">Resumen</span>
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
