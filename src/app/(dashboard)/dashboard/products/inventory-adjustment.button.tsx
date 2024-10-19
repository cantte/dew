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
    <Button asChild>
      <Link href="/dashboard/inventory/adjustment">
        <ClipboardList />
        Ajuste de inventario
      </Link>
    </Button>
  )
}
