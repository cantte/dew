import { cashRegistersRouter } from "~/server/api/routers/cashRegisters";
import { customersProcedure } from "~/server/api/routers/customers";
import { employeesRouter } from "~/server/api/routers/employees";
import { productsRouter } from "~/server/api/routers/products";
import { salesProcedure } from "~/server/api/routers/sales";
import { storesProcedure } from "~/server/api/routers/stores";
import { userPreferencesRouter } from "~/server/api/routers/userPreferences";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productsRouter,
  customer: customersProcedure,
  sale: salesProcedure,
  store: storesProcedure,
  cashRegister: cashRegistersRouter,
  userPreference: userPreferencesRouter,
  employee: employeesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
