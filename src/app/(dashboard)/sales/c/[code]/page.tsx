import { notFound } from "next/navigation";
import React from "react";
import BackButton from "~/components/back-button";
import Footer from "~/components/footer";
import SaleDetail from "~/components/sale-detail";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";

type Props = {
  params: {
    code: string;
  };
};

const CustomerSaleDetailPage = async ({ params }: Props) => {
  const sale = await api.sale.findPublic.query({ code: params.code });

  if (!sale) {
    return notFound();
  }

  return (
    <main className="h-screen-ios relative z-20 mx-auto flex h-screen max-w-7xl flex-col justify-between overflow-x-hidden px-4">
      <header className="flex h-[80px] items-center justify-between md:h-[100px]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">beta</span>
          <Badge>alfa</Badge>
        </div>
      </header>

      <section className="mb-4 space-y-4">
        <div>
          <BackButton />
        </div>

        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Detalle de venta</h1>
          <Badge>
            {sale.paymentMethod === "cash" ? "Efectivo" : "No registrado"}
          </Badge>
        </div>

        <SaleDetail sale={sale} />
      </section>

      <Footer />
    </main>
  );
};

export default CustomerSaleDetailPage;
