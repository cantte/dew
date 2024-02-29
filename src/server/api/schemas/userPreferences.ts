import { z } from "zod";

export const updateUserPreferencesInput = z.object({
  storeId: z.string().min(1).max(36),
});
