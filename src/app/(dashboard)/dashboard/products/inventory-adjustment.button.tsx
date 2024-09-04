'use client'

import { ClipboardList } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { usePermissions } from '~/hooks/use-permissions'

export const InventoryAdjustmentButton = () => {
  const { hasPermissions } = usePermissions()
  const canUpdateInventory = hasPermissions(['inventory:update'])

  if (!canUpdateInventory) {
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
