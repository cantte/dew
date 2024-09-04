'use client'

import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { usePermissions } from '~/hooks/use-permissions'

const CreateProductButton = () => {
  const { hasPermissions } = usePermissions()
  const canCreateProduct = hasPermissions(['product:create'])

  if (!canCreateProduct) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href="/dashboard/products/create">
        <PlusCircle className="size-4 sm:mr-2" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Agregar producto
        </span>
      </Link>
    </Button>
  )
}

export default CreateProductButton
