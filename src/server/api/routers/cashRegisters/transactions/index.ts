import authedProcedure from "~/server/api/procedures/authed";
import createCashRegisterTransaction from "~/server/api/routers/cashRegisters/transactions/create";
import listCashRegisterTransactions from "~/server/api/routers/cashRegisters/transactions/list";
import {
  createCashRegisterTransactionInput,
  listCashRegisterTransactionsInput,
} from "~/server/api/schemas/cashRegisters";
import { router } from "~/server/api/trpc";

const cashRegisterTransactionsRouter = router({
  create: authedProcedure
    .input(createCashRegisterTransactionInput)
    .mutation(async ({ ctx, input }) => {
      await createCashRegisterTransaction({ ctx, input });
    }),
  list: authedProcedure
    .input(listCashRegisterTransactionsInput)
    .query(async ({ ctx, input }) => {
      return await listCashRegisterTransactions({ ctx, input });
    }),
});

export default cashRegisterTransactionsRouter;
