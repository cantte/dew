import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/server'

const CreateProductButton = async () => {
  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['product:create'],
  })

  if (!hasPermissions) {
    return null
  }

  return (
    <Button asChild size="sm" className="h-7 gap-1">
      <Link href="/dashboard/products/create">
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Agregar producto
        </span>
      </Link>
    </Button>
  )
}

export default CreateProductButton
