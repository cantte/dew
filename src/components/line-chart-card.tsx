'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import {
  CartesianGrid,
  Tooltip as ChartTooltip,
  LabelList,
  Line,
  LineChart,
  XAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '~/components/ui/chart'
import { formatToCurrency, formatToShortMonth } from '~/text/format'

type Props = {
  title: string
  value: number
  valueImprovement: number

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

const LineChartCard = ({ title, value, valueImprovement, summary }: Props) => {
  return (
    <Card className="shadow-none">
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
            <LineChart
              accessibilityLayer
              data={summary}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
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

              <Line
                dataKey="total"
                type="linear"
                stroke="var(--color-total)"
                strokeWidth={2}
                dot={false}
              >
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: unknown) =>
                    formatToCurrency('es-CO', value as number)
                  }
                />
              </Line>
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <span>
            {Intl.NumberFormat('es-CO', {
              style: 'percent',
              signDisplay: 'always',
              minimumFractionDigits: 2,
            }).format(valueImprovement)}{' '}
            respecto al periodo anterior{' '}
          </span>
          {valueImprovement > 0 ? (
            <span className="rounded-full bg-secondary p-1">
              <TrendingUp className="h-3 w-3 text-success-text" />
            </span>
          ) : (
            <span className="rounded-full bg-secondary p-1">
              <TrendingDown className="h-3 w-3 text-destructive" />
            </span>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

export default LineChartCard
