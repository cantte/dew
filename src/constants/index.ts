export const orderStatus = [
  { id: "pending", label: "Pendiente" },
  { id: "processing", label: "Procesando" },
  { id: "shipped", label: "Enviado" },
  { id: "delivered", label: "Entregado" },
  { id: "cancelled", label: "Cancelado" },
] as const;

export const paymentMethods = [
  { id: "cash", label: "Efectivo" },
  { id: "creditCard", label: "Tarjeta de crédito" },
  { id: "debitCard", label: "Tarjeta de débito" },
  { id: "transfer", label: "Transferencia" },
] as const;
