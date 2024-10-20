'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMediaQuery } from '@uidotdev/usehooks'
import { ArrowDownCircle, ArrowUpCircle, RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import type { TypeOf } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { useToast } from '~/components/ui/use-toast'
import { createCashRegisterTransactionInput } from '~/server/api/schemas/cashRegisters'
import { api } from '~/trpc/react'

type Props = {
  cashRegisterId: string
}

type FormValues = TypeOf<typeof createCashRegisterTransactionInput>

const CashRegisterActions = ({ cashRegisterId }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createCashRegisterTransactionInput),
    defaultValues: {
      cashRegisterId: cashRegisterId,
    },
  })

  const createCashRegisterTransaction =
    api.cashRegister.transactions.create.useMutation()

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    createCashRegisterTransaction.mutate(values)
  }

  const [open, setOpen] = useState(false)

  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (createCashRegisterTransaction.isSuccess) {
      setOpen(false)
      router.refresh()
      utils.cashRegister.transactions.list.invalidate()
      form.reset()

      toast({
        title: 'Éxito',
        description: 'La transacción se realizó con éxito.',
      })
    }
  }, [createCashRegisterTransaction.isSuccess])

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (createCashRegisterTransaction.error) {
      form.setError('amount', {
        type: 'manual',
        message: createCashRegisterTransaction.error.message,
      })
    }
  }, [createCashRegisterTransaction.error])

  const inTransaction = () => {
    setOpen(true)
    form.setValue('type', 'in')
  }

  const outTransaction = () => {
    setOpen(true)
    form.setValue('type', 'out')
  }

  const isDesktop = useMediaQuery('(min-width: 768px)')

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button onClick={inTransaction}>
        <ArrowUpCircle />
        Realizar ingreso
      </Button>

      <Button variant="secondary" onClick={outTransaction}>
        <ArrowDownCircle />
        Realizar egreso
      </Button>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {form.watch('type') === 'in' ? 'Ingreso' : 'Egreso'}
              </DialogTitle>
              <DialogDescription>
                {form.watch('type') === 'in'
                  ? 'Registra un ingreso en la caja.'
                  : 'Registra un egreso en la caja.'}
              </DialogDescription>
            </DialogHeader>
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={createCashRegisterTransaction.isPending}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observación</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={createCashRegisterTransaction.isPending}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={createCashRegisterTransaction.isPending}
                  >
                    {createCashRegisterTransaction.isPending && (
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Realizar transacción
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>
                {form.watch('type') === 'in' ? 'Ingreso' : 'Egreso'}
              </DrawerTitle>
              <DrawerDescription>
                {form.watch('type') === 'in'
                  ? 'Registra un ingreso en la caja.'
                  : 'Registra un egreso en la caja.'}
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={createCashRegisterTransaction.isPending}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observación</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={createCashRegisterTransaction.isPending}
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={createCashRegisterTransaction.isPending}
                  >
                    {createCashRegisterTransaction.isPending && (
                      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Realizar transacción
                  </Button>
                </form>
              </Form>
            </div>
            <DrawerFooter className="pt-2">
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}

export default CashRegisterActions
