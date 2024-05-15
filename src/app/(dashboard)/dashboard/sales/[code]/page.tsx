import { notFound } from "next/navigation";
import BackButton from "~/components/back-button";
import SaleDetail from "~/components/sale-detail";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";

type SaleDetailPageProps = {
  params: {
    code: string;
  };
};

const SaleDetailPage = async ({ params }: SaleDetailPageProps) => {
  const sale = await api.sale.find({ code: params.code });

  if (!sale) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <BackButton />
      <div className="flex items-center justify-center gap-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Venta
        </h3>
        <Badge>
          {sale.paymentMethod === "cash" ? "Efectivo" : "No registrado"}
        </Badge>
      </div>

      <SaleDetail sale={sale} />
    </div>
  );
};

export default SaleDetailPage;
