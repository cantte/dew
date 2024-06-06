import { CalendarIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, type HTMLAttributes } from "react";
import { type DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/lib/utils";

type DateRangeFilterProps<TData> = HTMLAttributes<HTMLDivElement> & {
  table: Table<TData>;
};

const DateRangeFilter = <TData,>({
  table,
  className,
}: DateRangeFilterProps<TData>) => {
  const date = table.getColumn("createdAt")?.getFilterValue() as DateRange;

  const setDate = (date: DateRange | undefined) => {
    table.getColumn("createdAt")?.setFilterValue(date);
  };

  useEffect(() => {
    if (date?.from === undefined) {
      return;
    }

    if (date.to === undefined) {
      return;
    }

    table.getColumn("createdAt")?.setFilterValue(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: es })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: es })
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
  );
};

export default DateRangeFilter;
