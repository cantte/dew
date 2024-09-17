'use client'

import type { Row } from '@tanstack/react-table'
import { EllipsisVertical } from 'lucide-react'
import NextLink from 'next/link'
import type { Product } from '~/app/(dashboard)/dashboard/products/columns'
import BarcodeModal from '~/components/products/barcode-modal'
import CreateProductDiscountDialog from '~/components/products/create-discount'
import DeleteProductModal from '~/components/products/delete-modal'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { usePermissions } from '~/hooks/use-permissions'

type DataTableRowActionsProps = {
  row: Row<Product>
}

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  const { hasPermissions } = usePermissions()

  const canDeleteProduct = hasPermissions(['product:delete'])
  const canEditProduct = hasPermissions(['product:update'])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[250px]">
        {canEditProduct && (
          <>
            <DropdownMenuItem asChild>
              <NextLink href={`/dashboard/products/${row.original.id}/edit`}>
                Editar
              </NextLink>
            </DropdownMenuItem>
            <CreateProductDiscountDialog product={row.original} />
          </>
        )}

        {canDeleteProduct && <DeleteProductModal product={row.original} />}

        <BarcodeModal product={row.original} />

        <DropdownMenuItem asChild>
          <NextLink href={`/dashboard/products/${row.original.id}`}>
            Ver detalles
          </NextLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DataTableRowActions
