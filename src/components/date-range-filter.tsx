"use client";

import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { type DateRange as DateRangePicker } from "react-day-picker";
import DateRange from "~/components/date-range";
import { Button } from "~/components/ui/button";

type Props = {
  selected: DateRangePicker | undefined;
  onSelectRange: (range: DateRangePicker | undefined) => void;
};

const DateRangeFilter = ({ selected, onSelectRange }: Props) => {
  const today = new Date();
  const setToday = () => {
    onSelectRange({
      from: startOfDay(today),
      to: endOfDay(today),
    });
  };

  const setThisWeek = () => {
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });

    onSelectRange({
      from: start,
      to: end,
    });
  };

  const setThisMonth = () => {
    const start = startOfMonth(today);
    const end = endOfMonth(today);

    onSelectRange({
      from: start,
      to: end,
    });
  };

  return (
    <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
      <DateRange
        className="w-[300px]"
        selected={selected}
        onSelectRange={onSelectRange}
      />

      <div className="space-x-2">
        <Button variant="outline" className="border-dashed" onClick={setToday}>
          Hoy
        </Button>

        <Button
          variant="outline"
          className="border-dashed"
          onClick={setThisWeek}
        >
          Esta semana
        </Button>

        <Button
          variant="outline"
          className="border-dashed"
          onClick={setThisMonth}
        >
          Este mes
        </Button>
      </div>
    </div>
  );
};

export default DateRangeFilter;
