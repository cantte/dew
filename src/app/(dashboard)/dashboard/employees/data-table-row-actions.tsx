'use client'

import type { Row } from '@tanstack/react-table'
import { EllipsisVerticalIcon } from 'lucide-react'
import Link from 'next/link'
import type { Employee } from '~/app/(dashboard)/dashboard/employees/columns'
import { DeleteEmployeeDialog } from '~/components/employees/delete-modal'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { usePermissions } from '~/hooks/use-permissions'

type Props = {
  row: Row<Employee>
}

export const EmployeeDataTableRowActions = ({ row }: Props) => {
  const { hasPermissions } = usePermissions()

  const canEditEmployee = hasPermissions(['employee:update'])
  const canDeleteEmployee = hasPermissions(['employee:delete'])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <EllipsisVerticalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[250px]">
        {canEditEmployee && (
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/employees/${row.original.id}/edit`}>
              Editar
            </Link>
          </DropdownMenuItem>
        )}

        {canDeleteEmployee && <DeleteEmployeeDialog employee={row.original} />}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
