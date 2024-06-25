'use client'

import { ReloadIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

type Props = {
  storeId: string
  employeeId: string
}

const AcceptStoreInvitation = ({ storeId, employeeId }: Props) => {
  const linkEmployeeToStore = api.employee.linkToStore.useMutation()

  const acceptInvitation = () => {
    linkEmployeeToStore.mutate({
      storeId,
      employeeId,
    })
  }

  const router = useRouter()
  useEffect(() => {
    if (linkEmployeeToStore.isSuccess) {
      router.push(`/dashboard`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkEmployeeToStore.isSuccess])

  return (
    <>
      <Button
        className="mt-2"
        onClick={acceptInvitation}
        disabled={
          linkEmployeeToStore.isPending || linkEmployeeToStore.isSuccess
        }
      >
        {(linkEmployeeToStore.isPending || linkEmployeeToStore.isSuccess) && (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        Aceptar invitación
      </Button>

      {linkEmployeeToStore.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {linkEmployeeToStore.error.message}
          </AlertDescription>
        </Alert>
      )}
    </>
  )
}

export default AcceptStoreInvitation
