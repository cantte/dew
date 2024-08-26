'use client'

import { Label } from '~/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { useYearMonthFilter } from '~/hooks/use-year-month-filter'
import { formatToMonthName } from '~/text/format'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  selectableMonths: RouterOutputs['sale']['selectableMonths']
}

export const SelectMonth = ({ selectableMonths }: Props) => {
  const { month, setMonth } = useYearMonthFilter()

  const onSelectMonth = (month: string) => {
    setMonth(Number(month))
  }

  return (
    <div className="space-y-2">
      <Label>Reporte mensual</Label>
      <Select defaultValue={month.toString()} onValueChange={onSelectMonth}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Seleccionar mes" />
        </SelectTrigger>
        <SelectContent>
          {selectableMonths.map((month) => (
            <SelectItem key={month.month} value={month.month.toString()}>
              {formatToMonthName('es-CO', new Date(2021, month.month - 1, 1))}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
