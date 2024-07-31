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
    <Button asChild size="sm" className="h-7 gap-1">
      <Link href="/dashboard/inventory/adjustment">
        <ClipboardList className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Ajuste de inventario
        </span>
      </Link>
    </Button>
  )
}
