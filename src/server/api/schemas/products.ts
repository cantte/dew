import { z } from "zod";
import { byStoreInput } from "~/server/api/schemas/common";

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

export const searchProductsInput = byStoreInput.extend({
  query: z.string().min(1).max(255),
});
