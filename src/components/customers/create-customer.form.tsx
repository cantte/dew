'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCw } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { TypeOf } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { createCustomerInput } from '~/server/api/schemas/customers'
import { api } from '~/trpc/react'

type Props = {
  id?: string
  onCreate: () => void
}

type FormValues = TypeOf<typeof createCustomerInput>

const CreateCustomerForm = ({ onCreate, id }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createCustomerInput),
    defaultValues: {
      id,
    },
  })

  const createCustomer = api.customer.create.useMutation()

  // biome-ignore lint/correctness/useExhaustiveDependencies: no needed
  useEffect(() => {
    if (createCustomer.isSuccess) {
      form.reset()
      onCreate()
    }
  }, [createCustomer.isSuccess])

  const onSubmit = (data: FormValues) => {
    createCustomer.mutate(data)
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Identificación</FormLabel>
              <FormControl>
                <Input required autoFocus {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={createCustomer.isPending}
          onClick={(e) => e.stopPropagation()}
        >
          {createCustomer.isPending && (
            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
          )}
          Registrar
        </Button>
      </form>
    </Form>
  )
}

export default CreateCustomerForm
