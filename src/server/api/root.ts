import { cashRegistersRouter } from "~/server/api/routers/cashRegisters";
import { customersProcedure } from "~/server/api/routers/customers";
import { employeesRouter } from "~/server/api/routers/employees";
import { inventoryRouter } from "~/server/api/routers/inventory";
import { productsRouter } from "~/server/api/routers/products";
import { salesProcedure } from "~/server/api/routers/sales";
import { storesProcedure } from "~/server/api/routers/stores";
import { userPreferencesRouter } from "~/server/api/routers/userPreferences";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productsRouter,
  inventory: inventoryRouter,
  customer: customersProcedure,
  sale: salesProcedure,
  store: storesProcedure,
  cashRegister: cashRegistersRouter,
  userPreference: userPreferencesRouter,
  employee: employeesRouter,
});

export const createCaller = createCallerFactory(appRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
