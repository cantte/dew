import { productsRouter } from "~/server/api/routers/products";
import { createTRPCRouter } from "~/server/api/trpc";
import { customersProcedure } from "./routers/customers";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  product: productsRouter,
  customer: customersProcedure,
});

// export type definition of API
export type AppRouter = typeof appRouter;
