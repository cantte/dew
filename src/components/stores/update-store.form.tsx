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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useToast } from '~/components/ui/use-toast'
import { updateStoreInput } from '~/server/api/schemas/stores'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
}

type FormValues = TypeOf<typeof updateStoreInput>

export const UpdateStoreForm = ({ store }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(updateStoreInput),
    defaultValues: {
      id: store.id,
      name: store.name,
      nit: store.nit ?? undefined,
      address: store.address ?? undefined,
      phone: store.phone ?? undefined,
    },
  })

  const updateStore = api.store.update.useMutation()
  const onSubmit = (values: FormValues) => {
    updateStore.mutate(values)
  }

  const router = useRouter()
  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (!updateStore.isSuccess) return

    toast({
      title: 'Éxito',
      description: 'Tienda actualizada correctamente',
    })

    router.refresh()
  }, [updateStore.isSuccess])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
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

        <div className="flex w-full justify-end pt-2">
          <Button type="submit" disabled={updateStore.isPending}>
            {updateStore.isPending && (
              <RotateCw className="mr-2 h-4 w-4 animate-spin" />
            )}
            Actualizar tienda
          </Button>
        </div>
      </form>
    </Form>
  )
}
