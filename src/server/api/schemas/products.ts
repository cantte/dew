import { z } from "zod";

export const createProductInput = z.object({
  code: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  purchasePrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),

  stores: z.array(z.string().uuid()).min(1),
});

export const updateProductInput = z.object({
  id: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  purchasePrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
});

export const linkToStoresInput = z.object({
  id: z.string().uuid(),
  stores: z.array(z.string().uuid()),
});
