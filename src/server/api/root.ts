import cashRegistersRouter from '~/server/api/routers/cashRegisters'
import customersRouter from '~/server/api/routers/customers'
import employeesRouter from '~/server/api/routers/employees'
import inventoryRouter from '~/server/api/routers/inventory'
import { menusRouter } from '~/server/api/routers/menus'
import ordersRouter from '~/server/api/routers/orders'
import productsRouter from '~/server/api/routers/products'
import rbacRouter from '~/server/api/routers/rbac'
import salesRouter from '~/server/api/routers/sales'
import storesProcedure from '~/server/api/routers/stores'
import { subscriptionsRouter } from '~/server/api/routers/subscriptions'
import userPreferencesRouter from '~/server/api/routers/userPreferences'
import { createCallerFactory, router } from '~/server/api/trpc'

export const appRouter = router({
  product: productsRouter,
  inventory: inventoryRouter,
  customer: customersRouter,
  sale: salesRouter,
  order: ordersRouter,
  store: storesProcedure,
  subscription: subscriptionsRouter,
  cashRegister: cashRegistersRouter,
  userPreference: userPreferencesRouter,
  employee: employeesRouter,
  rbac: rbacRouter,
  menu: menusRouter,
})

export const createCaller = createCallerFactory(appRouter)

export type AppRouter = typeof appRouter
