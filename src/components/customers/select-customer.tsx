import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import CreateCustomerForm from '~/components/customers/create-customer.form'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { api } from '~/trpc/react'

type Props = {
  onCustomerSelect: (customerId: string) => void
}

export const SelectCustomer = ({ onCustomerSelect }: Props) => {
  const [inputCustomerId, setInputCustomerId] = useState('')
  const customerId = useDebounce(inputCustomerId, 1000)

  const {
    data: customer,
    isFetching: isLoadingCustomer,
    error,
  } = api.customer.find.useQuery(
    {
      id: customerId,
    },
    {
      enabled: customerId !== '',
    },
  )

  const [customerNotFound, setCustomerNotFound] = useState(false)

  useEffect(() => {
    if (error) {
      if (error.message.includes('undefined')) {
        setCustomerNotFound(true)
        return
      }
    }

    if (customer) {
      setCustomerNotFound(false)
    }
  }, [error, customer])

  const onCreateCustomer = () => {
    onCustomerSelect(customerId)
  }

  return (
    <div className="grid gap-2">
      {!customerNotFound && (
        <Input
          autoFocus
          placeholder="Digite la identificación del cliente"
          value={inputCustomerId}
          onChange={(e) => setInputCustomerId(e.target.value)}
          disabled={isLoadingCustomer}
        />
      )}

      {!isLoadingCustomer && customerNotFound && (
        <CreateCustomerForm id={customerId} onCreate={onCreateCustomer} />
      )}

      {customer && (
        <div className="grid gap-4 text-sm">
          <div className="grid gap-2">
            <span>Cliente encontrado</span>
            <span>
              {customer.name} ({customer.id})
            </span>
          </div>
          <Button type="button" onClick={() => onCustomerSelect(customer.id)}>
            Seleccionar
          </Button>
        </div>
      )}
    </div>
  )
}
