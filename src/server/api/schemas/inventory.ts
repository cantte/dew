import { z } from "zod";

export const updateInventoryInput = z.object({
  id: z.string(),
  stock: z.coerce.number().min(1),
  quantity: z.coerce.number().min(0),
  operation: z.enum(["add", "remove"]),
});

export const findInventoryInput = z.object({
  id: z.string().uuid(),
  storeId: z.string().uuid(),
});
