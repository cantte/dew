'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { TypeOf } from 'zod'
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
import { createStoreInput } from '~/server/api/schemas/stores'
import { api } from '~/trpc/react'

export type FormValues = TypeOf<typeof createStoreInput>

type Props = {
  onSuccess?: () => void
}

const CreateStoreForm = ({ onSuccess }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(createStoreInput),
    defaultValues: {
      name: '',
      address: '',
    },
  })

  const createStore = api.store.create.useMutation()
  const onSubmit = (data: FormValues) => {
    createStore.mutate(data)
  }

  const router = useRouter()
  const utils = api.useUtils()
  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (createStore.isSuccess) {
      router.refresh()
      utils.store.findCurrent.invalidate()
      if (onSuccess) {
        onSuccess()
        return
      }

      router.push('/dashboard')
    }
  }, [createStore.isSuccess, router])

  return (
    <Form {...form}>
      <form
        className="flex flex-col space-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input autoFocus disabled={createStore.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input disabled={createStore.isPending} {...field} />
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
                <Input disabled={createStore.isPending} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NIT</FormLabel>
              <FormControl>
                <Input disabled={createStore.isPending} {...field} />
              </FormControl>

              <FormDescription>
                Digite el NIT sin guiones ni puntos.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={createStore.isPending}>
          {createStore.isPending && (
            <RotateCw className="mr-2 h-4 w-4 animate-spin" />
          )}
          Agregar tienda
        </Button>
      </form>
    </Form>
  )
}

export default CreateStoreForm
