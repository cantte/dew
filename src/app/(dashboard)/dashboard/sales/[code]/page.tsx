import { notFound } from "next/navigation";
import BackButton from "~/components/back-button";
import SaleDetail from "~/components/sale-detail";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
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
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline">
                {Intl.DateTimeFormat("es-CO", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date(sale.createdAt))}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Fecha de creación de la venta</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <SaleDetail sale={sale} />
    </div>
  );
};

export default SaleDetailPage;
