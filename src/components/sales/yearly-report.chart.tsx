'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
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
    month: string
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

export const YearlyReportChart = ({ data }: Props) => {
  return (
    <ChartContainer
      config={chartConfig}
      className="max-h-[400px] min-h-[80px] w-full"
    >
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
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

        <Bar
          dataKey="amount"
          stackId="a"
          fill="var(--color-amount)"
          radius={[0, 0, 4, 4]}
        />

        <Bar
          dataKey="profit"
          stackId="a"
          fill="var(--color-profit)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}
