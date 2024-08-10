import authedProcedure from '~/server/api/procedures/authed'
import publicProcedure from '~/server/api/procedures/public'
import { cancelSale } from '~/server/api/routers/sales/cancel'
import createSale from '~/server/api/routers/sales/create'
import findSale from '~/server/api/routers/sales/find'
import listSales from '~/server/api/routers/sales/list'
import getSalesOverview from '~/server/api/routers/sales/overview'
import generateSalesReport from '~/server/api/routers/sales/report'
import { generateYearlySalesReport } from '~/server/api/routers/sales/yearly-report'
import { byStoreInput } from '~/server/api/schemas/common'
import {
  createSaleInput,
  findSaleInput,
  getSalesOverviewInput,
} from '~/server/api/schemas/sales'
import { router } from '~/server/api/trpc'

const salesRouter = router({
  create: authedProcedure
    .input(createSaleInput)
    .mutation(async ({ ctx, input }) => {
      await createSale({ ctx, input })
    }),
  list: authedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return await listSales({ ctx, input })
  }),
  overview: authedProcedure
    .input(getSalesOverviewInput)
    .query(async ({ ctx, input }) => {
      return await getSalesOverview({ ctx, input })
    }),
  find: authedProcedure.input(findSaleInput).query(async ({ ctx, input }) => {
    return await findSale({ ctx, input })
  }),
  findPublic: publicProcedure
    .input(findSaleInput)
    .query(async ({ ctx, input }) => {
      return await findSale({ ctx, input })
    }),
  report: authedProcedure
    .input(getSalesOverviewInput)
    .query(async ({ ctx, input }) => {
      return await generateSalesReport({ ctx, input })
    }),
  cancel: authedProcedure
    .input(findSaleInput)
    .mutation(async ({ ctx, input }) => {
      return await cancelSale({ ctx, input })
    }),
  yearlyReport: authedProcedure.query(async ({ ctx }) => {
    return await generateYearlySalesReport({ ctx })
  }),
})

export default salesRouter
