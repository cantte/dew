'use client'

import { useRouter } from 'next/navigation'
import { Fragment, useEffect, useState } from 'react'
import ConfirmDialog from '~/components/confirm-dialog'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  store: NonNullable<RouterOutputs['store']['findCurrent']>
}

export const DeleteStore = ({ store }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const deleteStore = api.store.delete.useMutation()

  const handleDelete = () => {
    deleteStore.mutate({ id: store.id })
  }

  const utils = api.useUtils()
  const router = useRouter()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (deleteStore.isSuccess) {
      utils.store.findCurrent.invalidate()
      utils.store.list.invalidate()
      router.refresh()
      router.push('/dashboard')
    }
  }, [deleteStore.isSuccess])

  return (
    <Fragment>
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleDelete}
        title="Eliminar tienda"
        description="¿Estás seguro que deseas eliminar esta tienda?"
      />

      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-destructive text-xl">
              Eliminar tienda
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-destructive/80">
            Si deseas eliminar tu tienda, puedes hacerlo aquí. Ten en cuenta que
            esta acción no se puede deshacer.
          </p>
        </CardContent>

        <CardFooter>
          <Button variant="destructive" onClick={() => setIsOpen(true)}>
            Deseo eliminar mi tienda
          </Button>
        </CardFooter>
      </Card>
    </Fragment>
  )
}
