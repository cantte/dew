import { z } from "zod";

export const createCustomerInput = z.object({
    id: z.string().min(1).max(32),
    name: z.string().min(1).max(128),
    email: z.string().max(255).optional(),
    phone: z.string().max(32).optional(),
});
