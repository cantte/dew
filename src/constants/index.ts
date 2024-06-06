export const orderStatus = [
  { id: "pending", label: "Pendiente", next: "processing" },
  { id: "processing", label: "Procesando", next: "shipped" },
  { id: "shipped", label: "Enviado", next: "delivered" },
  { id: "delivered", label: "Entregado" },
  { id: "cancelled", label: "Cancelado" },
] as const;

export const paymentMethods = [
  { id: "cash", label: "Efectivo" },
  { id: "creditCard", label: "Tarjeta de crédito" },
  { id: "debitCard", label: "Tarjeta de débito" },
  { id: "transfer", label: "Transferencia" },
] as const;
