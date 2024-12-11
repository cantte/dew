'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { CreditCardIcon, RotateCw } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { usePaymentInputs } from 'react-payment-inputs'
import images, { type CardImages } from 'react-payment-inputs/images'
import type { TypeOf } from 'zod'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Separator } from '~/components/ui/separator'
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { useToast } from '~/components/ui/use-toast'
import { createSubscriptionInput } from '~/server/api/schemas/subscriptions'
import { formatToCurrency } from '~/text/format'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
  email: string
}

type FormValues = TypeOf<typeof createSubscriptionInput>
type Plan = FormValues['planId']

export const CreateSubscriptionForm = ({ store, email }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createSubscriptionInput),
    defaultValues: {
      planId: 'dew_mensual',
      customer: {
        docType: 'CC',
        email,
      },
    },
  })

  const createSubscription = api.subscription.create.useMutation()

  const router = useRouter()
  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (!createSubscription.isSuccess) return

    toast({
      title: 'Pago realizado',
      description: 'Tu pago ha sido realizado con éxito.',
    })

    router.refresh()
    router.push('/dashboard/account')
  }, [createSubscription.isSuccess])

  const onSubmit = (data: FormValues) => {
    createSubscription.mutate(data)
  }

  const onPlanChange = (value: string) => {
    form.setValue('planId', value as Plan)
  }

  const isYearly = form.watch('planId') === 'dew_anual'

  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
  } = usePaymentInputs()

  return (
    <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grow grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded border p-4 md:col-span-2">
              <div className="grid gap-4">
                <div>
                  <p className="font-bold text-lg">Datos de pago</p>
                </div>

                <div className="space-y-2">
                  <legend className="font-medium text-foreground text-sm">
                    Información de la tarjeta
                  </legend>

                  <div className="rounded-lg shadow-black/5 shadow-sm">
                    <FormField
                      control={form.control}
                      name="card.number"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative focus-within:z-10">
                              <Input
                                autoFocus
                                className="peer rounded-b-none pe-9 shadow-none [direction:inherit]"
                                {...getCardNumberProps({
                                  onBlur: field.onBlur,
                                  onChange: field.onChange,
                                })}
                                placeholder="Número de tarjeta"
                              />

                              <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                {meta.cardType ? (
                                  <svg
                                    className="overflow-hidden rounded-sm"
                                    {...getCardImageProps({
                                      images: images as unknown as CardImages,
                                    })}
                                    width={20}
                                  />
                                ) : (
                                  <CreditCardIcon
                                    size={16}
                                    strokeWidth={2}
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="-mt-px flex">
                      <div className="min-w-0 flex-1 focus-within:z-10">
                        <FormField
                          control={form.control}
                          name="card.expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="rounded-e-none rounded-t-none shadow-none [direction:inherit]"
                                  {...getExpiryDateProps({
                                    onBlur: field.onBlur,
                                    onChange: field.onChange,
                                  })}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="-ms-px min-w-0 flex-1 focus-within:z-10">
                        <FormField
                          control={form.control}
                          name="card.cvc"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  className="rounded-s-none rounded-t-none shadow-none [direction:inherit]"
                                  {...getCVCProps({
                                    onBlur: field.onBlur,
                                    onChange: field.onChange,
                                  })}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-lg">
                    Datos del titular de la tarjeta
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="customer.docNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de documento de identidad</FormLabel>
                      <FormControl>
                        <Input type="text" autoFocus {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="customer.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nombre del titular de la tarjeta
                          </FormLabel>
                          <FormControl>
                            <Input type="text" autoFocus {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customer.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Apellido del titular de la tarjeta
                          </FormLabel>
                          <FormControl>
                            <Input type="text" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="customer.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número de teléfono del titular de la tarjeta
                      </FormLabel>
                      <FormControl>
                        <Input type="text" autoFocus {...field} />
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
                  <Badge>{store.name}</Badge>
                </div>

                <div>
                  <p className="font-bold text-lg">Plan de suscripción</p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  <Tabs
                    defaultValue="dew_mensual"
                    value={form.watch('planId')}
                    onValueChange={onPlanChange}
                  >
                    <TabsList>
                      <TabsTrigger value="dew_mensual">Mensual</TabsTrigger>
                      <TabsTrigger value="dew_anual">Anual</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <Card className="w-full">
                    <CardHeader className="pt-4 pb-8">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Plan inicial</CardTitle>

                        {isYearly && <Badge>Ahorra 25%</Badge>}
                      </div>

                      <div className="flex gap-0.5">
                        <h3 className="font-bold text-3xl">
                          {formatToCurrency('es-CO', isYearly ? 180000 : 20000)}
                        </h3>
                        <span className="mb-1 flex flex-col justify-end text-sm">
                          /{isYearly ? 'año' : 'mes'}
                        </span>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                <Separator />

                <div className="grid gap-3 text-sm">
                  <span className="font-semibold leading-none">Resumen</span>

                  <ul className="grid gap-1">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span>
                        {formatToCurrency('es-CO', isYearly ? 180000 : 20000)}
                      </span>
                    </li>
                  </ul>

                  <small className="text-muted-foreground">
                    El cargo se realizará en pesos colombianos a tu tarjeta. Tu
                    plan se renovará automáticamente al final de cada ciclo de
                    facturación. Puedes cancelar en cualquier momento.
                  </small>

                  <small className="text-muted-foreground">
                    Al realizar el pago, aceptas nuestra{' '}
                    <Link href="/privacy" className="text-primary">
                      política de privacidad
                    </Link>
                    . Tu compra es segura.
                  </small>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Button type="submit" disabled={createSubscription.isPending}>
                  {createSubscription.isPending && (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Realizar pago
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
