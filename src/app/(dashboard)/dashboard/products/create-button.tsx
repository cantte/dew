'use client'

import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { usePermissions } from '~/hooks/use-permissions'

export const CreateProductButton = () => {
  const { hasPermissions } = usePermissions()
  const canCreateProduct = hasPermissions(['product:create'])

  if (!canCreateProduct) {
    return null
  }

  return (
    <Button asChild>
      <Link href="/dashboard/products/create">
        <PlusCircle />
        Agregar producto
      </Link>
    </Button>
  )
}
