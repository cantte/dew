'use client'

import { RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { useToast } from '~/components/ui/use-toast'
import { formatToDateShort } from '~/text/format'
import { api } from '~/trpc/react'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  subscription: NonNullable<RouterOutputs['subscription']['find']>
}

export const CancelSubscriptionDialog = ({ subscription }: Props) => {
  const [open, setOpen] = useState(false)

  const cancelSubscription = api.subscription.cancel.useMutation()

  const onClosed = () => {
    setOpen(false)
  }

  const onConfirm = () => {
    cancelSubscription.mutate()
  }

  const onOpen = () => {
    setOpen(true)
  }

  const router = useRouter()
  const { toast } = useToast()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (!cancelSubscription.isSuccess) return

    setOpen(false)
    toast({
      title: 'Subscripción cancelada',
      description: 'Tu subscripción ha sido cancelada con éxito.',
    })
    router.refresh()
  }, [cancelSubscription.isSuccess])

  return (
    <>
      <Button variant="destructive" onClick={onOpen}>
        Cancelar subscripción
      </Button>

      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres cancelar la subscripción?
            </AlertDialogTitle>
            <AlertDialogDescription>
              No se te cobrará más y podrás seguir usando dew hasta el final del
              ciclo de facturación actual (el día{' '}
              {formatToDateShort('es-CO', subscription.periodEnd)}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={onClosed}
              disabled={cancelSubscription.isPending}
            >
              No, mantener subscripción
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={cancelSubscription.isPending}
            >
              {cancelSubscription.isPending && (
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sí, cancelar subscripción
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
