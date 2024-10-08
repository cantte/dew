'use client'

import { RotateCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

type Props = {
  storeId: string
}

const EnableCashButton = ({ storeId }: Props) => {
  const createCash = api.cashRegister.create.useMutation()

  const handleClick = () => {
    createCash.mutate({ storeId })
  }

  const router = useRouter()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (createCash.isSuccess) {
      router.refresh()
    }
  }, [createCash.isSuccess])

  return (
    <Button
      size="sm"
      className="mt-2"
      onClick={handleClick}
      disabled={createCash.isPending}
    >
      {createCash.isPending && (
        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
      )}
      Habilitar caja registradora
    </Button>
  )
}

export default EnableCashButton
