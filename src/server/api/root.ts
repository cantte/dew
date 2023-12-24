import { productsRouter } from "~/server/api/routers/products";
import { createTRPCRouter } from "~/server/api/trpc";
import { salesProcedure } from "~/server/api/routers/sales";
import { customersProcedure } from "~/server/api/routers/customers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productsRouter,
  customer: customersProcedure,
  sale: salesProcedure,
});

// export type definition of API
export type AppRouter = typeof appRouter;
