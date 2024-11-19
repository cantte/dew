import { differenceInDays, startOfMonth, subDays } from 'date-fns'
import { and, between, eq, sum } from 'drizzle-orm'
import type { TypeOf } from 'zod'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { getSalesOverviewInput } from '~/server/api/schemas/sales'
import { saleSummary } from '~/server/db/schema'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof getSalesOverviewInput>
}

type ReturnValue = {
  amount: {
    value: number
    variationRate?: number
  }
  sales: {
    value: number
    variationRate?: number
  }
  products: {
    value: number
    variationRate?: number
  }
  profit: {
    value: number
    variationRate?: number
  }
}

const BLANK_RETURN_VALUE: ReturnValue = {
  amount: {
    value: 0,
  },
  sales: {
    value: 0,
  },
  products: {
    value: 0,
  },
  profit: {
    value: 0,
  },
}

const genenrateSalesOverview = async ({ ctx, input }: Options) => {
  console.log('genenrateSalesOverview', input)

  const [summary] = await ctx.db
    .select({
      amount: sum(saleSummary.amount).mapWith(Number),
      sales: sum(saleSummary.sales).mapWith(Number),
      products: sum(saleSummary.products).mapWith(Number),
      profit: sum(saleSummary.profit).mapWith(Number),
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, input.storeId),
        between(saleSummary.createdAt, input.from, input.to),
      ),
    )

  if (!summary || summary.amount === null) {
    return BLANK_RETURN_VALUE
  }

  const dateDiff = differenceInDays(input.to, input.from)
  let newFrom = subDays(input.from, dateDiff)
  let newTo = subDays(input.to, dateDiff)

  if (dateDiff === 30) {
    newFrom = startOfMonth(newFrom)
    newTo = startOfMonth(newTo)
  }

  const [previousSummary] = await ctx.db
    .select({
      amount: sum(saleSummary.amount).mapWith(Number),
      sales: sum(saleSummary.sales).mapWith(Number),
      products: sum(saleSummary.products).mapWith(Number),
      profit: sum(saleSummary.profit).mapWith(Number),
    })
    .from(saleSummary)
    .where(
      and(
        eq(saleSummary.storeId, input.storeId),
        between(saleSummary.createdAt, newFrom, newTo),
      ),
    )

  if (!previousSummary || previousSummary.amount === null) {
    return {
      amount: {
        value: summary.amount,
      },
      sales: {
        value: summary.sales,
      },
      products: {
        value: summary.products,
      },
      profit: {
        value: summary.profit,
      },
    }
  }

  return {
    amount: {
      value: summary.amount,
      variationRate:
        (summary.amount - previousSummary.amount) / previousSummary.amount,
    },
    sales: {
      value: summary.sales,
      variationRate:
        (summary.sales - previousSummary.sales) / previousSummary.sales,
    },
    products: {
      value: summary.products,
      variationRate:
        (summary.products - previousSummary.products) /
        previousSummary.products,
    },
    profit: {
      value: summary.profit,
      variationRate:
        (summary.profit - previousSummary.profit) / previousSummary.profit,
    },
  }
}

export default genenrateSalesOverview
