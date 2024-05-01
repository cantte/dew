import { notFound } from "next/navigation";
import React from "react";
import SaleDetail from "~/components/sale-detail";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";

type Props = {
  params: {
    code: string;
  };
};

const CustomerSaleDetailPage = async ({ params }: Props) => {
  const sale = await api.sale.findPublic({ code: params.code });

  if (!sale) {
    return notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Detalle de venta</h1>
        <Badge>
          {sale.paymentMethod === "cash" ? "Efectivo" : "No registrado"}
        </Badge>
      </div>

      <SaleDetail sale={sale} />
    </div>
  );
};

export default CustomerSaleDetailPage;
