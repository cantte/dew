import { z } from "zod";

export const createCashRegisterInput = z.object({
  storeId: z.string().min(1).max(36),
});

export const createCashRegisterTransactionInput = z.object({
  cashRegisterId: z.string().min(1).max(36),
  amount: z.number().min(0.01),
  type: z.enum(["IN", "OUT"]),
});
