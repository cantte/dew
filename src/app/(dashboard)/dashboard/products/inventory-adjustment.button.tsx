import { ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/server'

export const InventoryAdjustmentButton = async () => {
  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ['inventory:update'],
  })

  if (!hasPermissions) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href="/dashboard/inventory/adjustment">
        <ClipboardList className="size-4 sm:mr-2" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Ajuste de inventario
        </span>
      </Link>
    </Button>
  )
}
