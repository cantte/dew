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
  const [customerId, setCustomerId] = useState('')

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
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setCustomerId(inputCustomerId)
            }
          }}
          disabled={isLoadingCustomer}
        />
      )}

      {!isLoadingCustomer && customerNotFound && (
        <CreateCustomerForm id={customerId} onCreate={onCreateCustomer} />
      )}

      {customer && (
        <div className="grid gap-4 rounded border p-2 text-sm">
          <div className="grid gap-2">
            <span className="text-muted-foreground text-xs">
              Cliente encontrado
            </span>
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
