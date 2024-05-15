import { z } from "zod";

export const createStoreInput = z.object({
  name: z.string().min(1).max(64),
  address: z.string().min(1).max(64),
  phone: z.string().min(1).max(32).optional(),
});

export const findStoreInput = z.object({
  id: z.string().min(1).max(36),
});

export const updateStoreInput = createStoreInput.extend({
  id: z.string().min(1).max(36),
});
