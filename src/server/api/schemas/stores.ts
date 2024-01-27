import { z } from "zod";

export const createStoreInput = z.object({
  name: z.string().min(1).max(64),
  address: z.string().min(1).max(64),
  phone: z.string().min(1).max(32),
});
