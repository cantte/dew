import { z } from "zod";

export const createSaleItemInput = z.object({
  productId: z.string().min(1).max(32),
  quantity: z.coerce.number().min(0),
  purchasePrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  profit: z.coerce.number().min(0),
});

export const createSaleInput = z.object({
  customerId: z.string().min(1).max(32),
  amount: z.coerce.number().min(0),
  paymentMethod: z.string().max(32).optional(),
  payment: z.coerce.number().min(0),

  items: z.array(createSaleItemInput).min(1),
});
