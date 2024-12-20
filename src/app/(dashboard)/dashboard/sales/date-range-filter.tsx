import type { Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { type HTMLAttributes, useEffect } from 'react'
import type { DateRange } from 'react-day-picker'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

type DateRangeFilterProps<TData> = HTMLAttributes<HTMLDivElement> & {
  table: Table<TData>
  columnId: string
}

const DateRangeFilter = <TData,>({
  table,
  columnId,
  className,
}: DateRangeFilterProps<TData>) => {
  const date = table.getColumn(columnId)?.getFilterValue() as DateRange

  const setDate = (date: DateRange | undefined) => {
    table.getColumn(columnId)?.setFilterValue(date)
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    if (date?.from === undefined) {
      return
    }

    if (date.to === undefined) {
      return
    }

    table.getColumn(columnId)?.setFilterValue(date)
  }, [date])

  return (
    <div className={cn('grid gap-2')}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              'w-56 justify-start text-left font-normal sm:w-60',
              !date && 'text-muted-foreground',
              className,
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y', { locale: es })} -{' '}
                  {format(date.to, 'LLL dd, y', { locale: es })}
                </>
              ) : (
                format(date.from, 'LLL dd, y', { locale: es })
              )
            ) : (
              <span>Seleccione una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(date) => setDate(date)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateRangeFilter
