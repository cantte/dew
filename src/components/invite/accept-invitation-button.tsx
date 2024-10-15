'use client'

import { RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

type Props = {
  token: string
}

export const AcceptInvitationButton = ({ token }: Props) => {
  const acceptInvitation = api.employee.acceptInvitationLink.useMutation()

  const handleAcceptInvitation = () => {
    acceptInvitation.mutate({ token })
  }

  const router = useRouter()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (acceptInvitation.isSuccess) {
      router.push('/dashboard')
    }
  }, [acceptInvitation.isSuccess])

  return (
    <Button
      className="w-full px-6 py-3 font-light transition-colors duration-300"
      onClick={handleAcceptInvitation}
      disabled={acceptInvitation.isPending}
    >
      {acceptInvitation.isPending && (
        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
      )}
      Aceptar invitación
    </Button>
  )
}
