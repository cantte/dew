import { z, type TypeOf } from "zod";

export const createSaleItemInput = z.object({
  productId: z.string().min(1).max(64),
  quantity: z.coerce.number().min(0),
  purchasePrice: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0),
  profit: z.coerce.number().min(0),
});

export const createSaleInput = z
  .object({
    customerId: z.string().min(1).max(32),
    amount: z.coerce.number().min(0),
    paymentMethod: z.enum([
      "Cash",
      "CreditCard",
      "DebitCard",
      "Transfer",
    ] as const),
    payment: z.coerce.number().min(0),
    storeId: z.string().min(1).max(36),

    items: z.array(createSaleItemInput).min(1),
  })
  .refine((data) => data.payment >= data.amount, {
    message: "El monto de pago debe ser mayor o igual al monto total",
    path: ["payment"],
  });

export type PaymentMethod = TypeOf<typeof createSaleInput>["paymentMethod"];

export const paymentMethods = [
  { value: "Cash", label: "Efectivo" },
  { value: "CreditCard", label: "Tarjeta de crédito" },
  { value: "DebitCard", label: "Tarjeta de débito" },
  { value: "Transfer", label: "Transferencia" },
] as const;

export const getSalesOverviewInput = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
  storeId: z.string().min(1).max(36),
});

export const findSaleInput = z.object({ code: z.string() });
