'use client'

import { useMediaQuery } from '@uidotdev/usehooks'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { TypeOf } from 'zod'
import { SelectCustomer } from '~/components/customers/select-customer'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '~/components/ui/drawer'
import type { createSaleInput } from '~/server/api/schemas/sales'
import { api } from '~/trpc/react'

export type FormValues = TypeOf<typeof createSaleInput>

export const SelectSaleCustomer = () => {
  const form = useFormContext<FormValues>()
  const customerId = form.watch('customerId')

  const { data: customer, isPending: isLoadingCustomer } =
    api.customer.find.useQuery(
      {
        id: customerId,
      },
      {
        enabled: customerId !== '',
      },
    )

  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const toggleOpen = () => {
    form.setValue('customerId', '')
    setOpen((prev) => !prev)
  }

  const handleCustomerSelect = (customerId: string) => {
    form.setValue('customerId', customerId)
    setOpen(false)
  }

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)

    if (!isOpen) {
      form.setValue('customerId', '222222222222')
    }
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={toggleOpen}>
        {isLoadingCustomer
          ? 'Cargando...'
          : (`${customer?.name} (${customer?.id})` ?? 'Seleccionar cliente')}
      </Button>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Seleccionar cliente</DialogTitle>
            </DialogHeader>

            <div>
              <SelectCustomer onCustomerSelect={handleCustomerSelect} />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Seleccionar cliente</DrawerTitle>
            </DrawerHeader>

            <div className="p-4">
              <SelectCustomer onCustomerSelect={handleCustomerSelect} />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}
