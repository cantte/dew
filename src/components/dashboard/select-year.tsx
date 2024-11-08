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
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  selectableYears: RouterOutputs['sale']['selectableYears']
}

export const SelectYear = ({ selectableYears }: Props) => {
  const { year, setYear } = useYearMonthFilter()

  const onSelectYear = (year: string) => {
    setYear(Number(year))
  }

  return (
    <div className="space-y-2">
      <Label className="scroll-m-20 font-semibold text-2xl tracking-tight">
        Reporte anual
      </Label>
      <Select defaultValue={year.toString()} onValueChange={onSelectYear}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Seleccionar año" />
        </SelectTrigger>
        <SelectContent>
          {selectableYears.map((year) => (
            <SelectItem key={year.year} value={year.year.toString()}>
              {year.year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
