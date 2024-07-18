import { useDebounce } from '@uidotdev/usehooks'
import { Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import type { TypeOf } from 'zod'
import CreateCustomerModal from '~/components/customers/create-customer.modal'
import { Button } from '~/components/ui/button'
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
import type { createSaleInput } from '~/server/api/schemas/sales'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

export type FormValues = TypeOf<typeof createSaleInput>

type Customer = RouterOutputs['customer']['find']

type Props = {
  onContinue: (customer?: Customer) => void
}

const SelectCustomerStep = ({ onContinue }: Props) => {
  const form = useFormContext<FormValues>()

  const customerId = useDebounce(form.watch('customerId'), 1000)
  const {
    data: customer,
    error: findCustomerError,
    isFetching: isFindingCustomer,
  } = api.customer.find.useQuery(
    { id: customerId },
    {
      enabled: customerId !== undefined && customerId !== '',
    },
  )

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (findCustomerError) {
      if (findCustomerError.message.includes('undefined')) {
        form.setError('customerId', {
          type: 'manual',
          message: 'El cliente no existe',
        })
        return
      }
    }

    if (customer) {
      form.setValue('customerId', customer.id)
      form.clearErrors('customerId')
    }
  }, [customer, findCustomerError])

  const handleContinueWithoutCustomer = () => {
    form.setValue('customerId', '222222222222')
    onContinue()
  }
  const [isOpenCreateCustomerModal, setIsOpenCreateCustomerModal] =
    useState(false)

  return (
    <div>
      <CreateCustomerModal
        open={isOpenCreateCustomerModal}
        id={customerId}
        onOpenChange={setIsOpenCreateCustomerModal}
      />

      <FormField
        control={form.control}
        name="customerId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Identificación cliente</FormLabel>
            <FormControl>
              <Input autoFocus disabled={isFindingCustomer} {...field} />
            </FormControl>

            {isFindingCustomer && (
              <FormDescription>Buscando cliente...</FormDescription>
            )}

            {!isFindingCustomer && !customer && (
              <div className="!mt-4 flex items-center space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleContinueWithoutCustomer}
                >
                  Continuar sin cliente
                </Button>
                <Popover>
                  <PopoverTrigger>
                    <Info className="h-4 w-4" />
                  </PopoverTrigger>
                  <PopoverContent>
                    <span className="text-muted-foreground text-sm">
                      Puedes continuar sin un cliente, se asociará la venta al
                      mostrador.
                    </span>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {customer && (
              <>
                <FormDescription>{customer.name}</FormDescription>
                <Button type="button" onClick={() => onContinue(customer)}>
                  Continuar
                </Button>
              </>
            )}

            <FormMessage />

            {findCustomerError?.message.includes('undefined') && (
              <Button
                type="button"
                onClick={() => setIsOpenCreateCustomerModal(true)}
                variant="outline"
              >
                Registrar cliente
              </Button>
            )}
          </FormItem>
        )}
      />
    </div>
  )
}

export default SelectCustomerStep
