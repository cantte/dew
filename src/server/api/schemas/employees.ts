import { z } from "zod";

export const createEmployeeInput = z.object({
  id: z.string().min(1).max(32),
  name: z.string().min(1).max(128),
  email: z.string().max(255),
  phone: z.string().max(32).optional(),
  storeId: z.string().min(1).max(36),
});

export const updateEmployeeInput = z.object({
  id: z.string().min(1).max(32),
  name: z.string().min(1).max(128),
  email: z.string().max(255),
  phone: z.string().max(32).optional(),
});
