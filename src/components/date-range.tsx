import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import type {
  DateRange as DateRangeType,
  SelectRangeEventHandler,
} from 'react-day-picker'
import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import { cn } from '~/lib/utils'

type Props = HTMLAttributes<HTMLDivElement> & {
  selected?: DateRangeType
  onSelectRange?: SelectRangeEventHandler
}

const DateRange = ({ className, selected, onSelectRange }: Props) => {
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !selected && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected?.from ? (
              selected.to ? (
                <>
                  {format(selected.from, 'LLL dd, y', { locale: es })} -{' '}
                  {format(selected.to, 'LLL dd, y', { locale: es })}
                </>
              ) : (
                format(selected.from, 'LLL dd, y', { locale: es })
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
            defaultMonth={selected?.from}
            selected={selected}
            onSelect={onSelectRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DateRange
