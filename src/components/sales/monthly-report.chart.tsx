'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/chart'
import { formatToCurrency } from '~/text/format'

type Props = {
  data: {
    day: number
    amount: number
    profit: number
  }[]
}

const chartConfig = {
  amount: {
    label: 'Ingresos',
    color: 'hsl(var(--chart-1))',
  },
  profit: {
    label: 'Ganancias',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

export const MonthlyReportChart = ({ data }: Props) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[400px] min-h-[80px] w-full"
    >
      <AreaChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />

        <ChartTooltip
          content={
            <ChartTooltipContent
              valueFormatter={(value) =>
                formatToCurrency('es-CO', value as number)
              }
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />

        <Area
          dataKey="amount"
          type="natural"
          stackId="a"
          fill="var(--color-amount)"
          fillOpacity={0.4}
          stroke="var(--color-amount)"
        />

        <Area
          dataKey="profit"
          type="natural"
          stackId="a"
          fill="var(--color-profit)"
          fillOpacity={0.4}
          stroke="var(--color-profit)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
