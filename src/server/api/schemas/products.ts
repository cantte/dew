import { z } from "zod";

export const createProductInput = z.object({
  code: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  purchasePrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  stock: z.coerce.number().min(0),
  quantity: z.coerce.number().min(0),
});

export const updateProductQuantityInput = z.object({
  id: z.string(),
  quantity: z.coerce.number().min(1),
  operation: z.enum(["add", "remove"]),
});
