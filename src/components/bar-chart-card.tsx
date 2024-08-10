'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import { formatToCurrency, formatToShortMonth } from '~/text/format'

type Props = {
  title: string
  value: number

  summary: {
    date: string
    total: number
  }[]
}

const chartConfig = {
  total: {
    label: 'Total',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export const BarChartCard = ({ title, value, summary }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{formatToCurrency('es-CO', value)}</CardDescription>
      </CardHeader>

      <CardContent>
        {summary.length > 0 && (
          <ChartContainer
            config={chartConfig}
            className="max-h-[200px] min-h-[80px] w-full"
          >
            <BarChart accessibilityLayer data={summary}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) =>
                  new Date(value as unknown as string).getDate().toString()
                }
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) =>
                      formatToShortMonth(
                        'es-CO',
                        new Date(value as unknown as string),
                      )
                    }
                    valueFormatter={(value) =>
                      formatToCurrency('es-CO', value as number)
                    }
                  />
                }
              />

              <Bar dataKey="total" fill="hsl(var(--color-total))" radius={8} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
