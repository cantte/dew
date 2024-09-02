'use client'

import { useState } from 'react'
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
import { formatToDateShort } from '~/text/format'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  subscription: NonNullable<RouterOutputs['subscription']['find']>
}

export const CancelSubscriptionDialog = ({ subscription }: Props) => {
  const [open, setOpen] = useState(false)

  const onClosed = () => {
    setOpen(false)
  }

  const onConfirm = () => {
    setOpen(false)
  }

  const onOpen = () => {
    setOpen(true)
  }

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
            <AlertDialogCancel onClick={onClosed}>
              No, mantener subscripción
            </AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              Sí, cancelar subscripción
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
