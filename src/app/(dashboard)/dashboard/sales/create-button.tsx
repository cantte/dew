import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/server'

const CreateSaleButton = async () => {
  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['sale:create'],
  })

  if (!hasPermissions) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href="/sales/create">
        <PlusCircle className="size-4 sm:mr-2" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Nueva venta
        </span>
      </Link>
    </Button>
  )
}

export default CreateSaleButton
