import authedProcedure from "~/server/api/procedures/authed";
import createCustomer from "~/server/api/routers/customers/create";
import findCustomer from "~/server/api/routers/customers/find";
import {
  createCustomerInput,
  findCustomerInput,
} from "~/server/api/schemas/customers";
import { router } from "~/server/api/trpc";

const customersRouter = router({
  create: authedProcedure
    .input(createCustomerInput)
    .mutation(async ({ ctx, input }) => {
      await createCustomer({ ctx, input });
    }),
  find: authedProcedure
    .input(findCustomerInput)
    .query(async ({ ctx, input }) => {
      return await findCustomer({ ctx, input });
    }),
});

export default customersRouter;
