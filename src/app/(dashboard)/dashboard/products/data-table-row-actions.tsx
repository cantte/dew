'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import type { Row } from '@tanstack/react-table'
import NextLink from 'next/link'
import type { Product } from '~/app/(dashboard)/dashboard/products/columns'
import BarcodeModal from '~/components/products/barcode-modal'
import CreateProductDiscountDialog from '~/components/products/create-discount'
import DeleteProductModal from '~/components/products/delete-modal'
import LinkToStoresModal from '~/components/products/link-to-stores-modal'
import UpdateInventoryModal from '~/components/products/update-inventory-modal'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { api } from '~/trpc/react'

type DataTableRowActionsProps = {
  row: Row<Product>
}

const DataTableRowActions = ({ row }: DataTableRowActionsProps) => {
  const canDeleteProduct = api.rbac.checkPermissions.useQuery({
    permissions: ['product:delete'],
  })

  const canEditProduct = api.rbac.checkPermissions.useQuery({
    permissions: ['product:update'],
  })

  const canUpdateInventory = api.rbac.checkPermissions.useQuery({
    permissions: ['inventory:update'],
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[250px]">
        {!canEditProduct.isPending && canEditProduct.data ? (
          <>
            <DropdownMenuItem asChild>
              <NextLink href={`/dashboard/products/${row.original.id}/edit`}>
                Editar
              </NextLink>
            </DropdownMenuItem>
            <LinkToStoresModal product={row.original} />
            <CreateProductDiscountDialog product={row.original} />
          </>
        ) : null}

        {!canDeleteProduct.isPending && canDeleteProduct.data ? (
          <DeleteProductModal product={row.original} />
        ) : null}

        {!canUpdateInventory.isPending && canUpdateInventory.data ? (
          <UpdateInventoryModal product={row.original} />
        ) : null}

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
