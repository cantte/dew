import authedProcedure from "~/server/api/procedures/authed";
import createCashRegister from "~/server/api/routers/cashRegisters/create";
import findCashRegister from "~/server/api/routers/cashRegisters/find";
import cashRegisterTransactionsRouter from "~/server/api/routers/cashRegisters/transactions";
import { createCashRegisterInput } from "~/server/api/schemas/cashRegisters";
import { byStoreInput } from "~/server/api/schemas/common";
import { router } from "~/server/api/trpc";

const cashRegistersRouter = router({
  create: authedProcedure
    .input(createCashRegisterInput)
    .mutation(async ({ ctx, input }) => {
      await createCashRegister({ ctx, input });
    }),
  find: authedProcedure.input(byStoreInput).query(async ({ ctx, input }) => {
    return await findCashRegister({ ctx, input });
  }),
  transactions: cashRegisterTransactionsRouter,
});

export default cashRegistersRouter;
