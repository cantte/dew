import authedProcedure from '~/server/api/procedures/authed'
import publicProcedure from '~/server/api/procedures/public'
import cancelOrder from '~/server/api/routers/orders/cancel'
import createOrder from '~/server/api/routers/orders/create'
import findOrder from '~/server/api/routers/orders/find'
import listOrders from '~/server/api/routers/orders/list'
import moveOrderToNextStatus from '~/server/api/routers/orders/moveToNextStatus'
import getOrderOverview from '~/server/api/routers/orders/overview'
import generateOrdersReport from '~/server/api/routers/orders/report'
import searchOrderHistory from '~/server/api/routers/orders/searchHistory'
import { byStoreInput } from '~/server/api/schemas/common'
import {
  byOrderIdInput,
  createOrderInput,
  getOrderOverviewInput,
} from '~/server/api/schemas/orders'
import { router } from '~/server/api/trpc'

const ordersRouter = router({
  create: authedProcedure
    .input(createOrderInput)
    .mutation(async ({ ctx, input }) => {
      await createOrder({ ctx, input })
    }),
  list: authedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return await listOrders({ ctx, input })
  }),
  cancel: authedProcedure
    .input(byOrderIdInput)
    .mutation(async ({ ctx, input }) => {
      await cancelOrder({ ctx, input })
    }),
  moveToNextStatus: authedProcedure
    .input(byOrderIdInput)
    .mutation(async ({ ctx, input }) => {
      await moveOrderToNextStatus({ ctx, input })
    }),
  find: authedProcedure.input(byOrderIdInput).query(async ({ ctx, input }) => {
    return await findOrder({ ctx, input })
  }),
  findPublic: publicProcedure
    .input(byOrderIdInput)
    .query(async ({ ctx, input }) => {
      return await findOrder({ ctx, input })
    }),
  history: authedProcedure
    .input(byOrderIdInput)
    .query(async ({ ctx, input }) => {
      return await searchOrderHistory({ ctx, input })
    }),
  overview: authedProcedure
    .input(getOrderOverviewInput)
    .query(async ({ ctx, input }) => {
      return await getOrderOverview({ ctx, input })
    }),
  report: authedProcedure
    .input(getOrderOverviewInput)
    .query(async ({ ctx, input }) => {
      return await generateOrdersReport({ ctx, input })
    }),
})

export default ordersRouter
