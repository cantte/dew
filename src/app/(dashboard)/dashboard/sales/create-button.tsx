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
    <Button asChild>
      <Link href="/sales/create">
        <PlusCircle />
        Nueva venta
      </Link>
    </Button>
  )
}

export default CreateSaleButton
