'use client'

import LineChartCard from '~/components/line-chart-card'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  profit: number
  profitImprovement: number

  profitData: RouterOutputs['sale']['report']['totalProfitPerDay']
}

const TotalProfit = ({ profit, profitImprovement, profitData }: Props) => {
  return (
    <LineChartCard
      title="Ganancias totales"
      value={profit}
      valueImprovement={profitImprovement}
      summary={profitData}
    />
  )
}

export default TotalProfit
