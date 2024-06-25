'use client'

import { ChevronLeftIcon } from '@radix-ui/react-icons'
import { Button } from '~/components/ui/button'
import { useRouter } from 'next/navigation'

const BackButton = () => {
  const router = useRouter()

  return (
    <Button variant="ghost" onClick={() => router.back()}>
      <ChevronLeftIcon className="mr-2 h-4 w-4" />
      Volver
    </Button>
  )
}

export default BackButton
