import { z } from "zod";

export const updateInventoryQuantityInput = z.object({
  id: z.string(),
  quantity: z.coerce.number().min(1),
  operation: z.enum(["add", "remove"]),
});
