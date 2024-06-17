import { notFound } from "next/navigation";
import BackButton from "~/components/back-button";
import NotEnoughPermissions from "~/components/not-enough-permissions";
import OrderDetail from "~/components/orders/detail";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { orderStatus } from "~/constants";
import { api } from "~/trpc/server";

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

const OrderDetailPage = async ({ params }: Props) => {
  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ["order:view"],
  });

  if (!hasPermissions) {
    return <NotEnoughPermissions />;
  }

  const order = await api.order.find({ id: params.id });

  if (!order) {
    return notFound();
  }

  const status = orderStatus.find((status) => status.id === order.status);

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
                }).format(new Date(order.createdAt))}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>Fecha de creación de la orden</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {status && (
          <Badge
            variant={order.status === "cancelled" ? "destructive" : "default"}
          >
            {status.label}
          </Badge>
        )}
      </div>

      <OrderDetail order={order} />
    </div>
  );
};

export default OrderDetailPage;
