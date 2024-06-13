import { endOfMonth, startOfMonth } from "date-fns";
import { Info } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { api } from "~/trpc/server";

const OrdersOverview = async () => {
  const store = await api.store.findCurrent();
  if (!store) {
    return null;
  }

  const today = new Date();
  const from = startOfMonth(today);
  const to = endOfMonth(today);

  const overview = await api.order.overview({
    from,
    to,
    storeId: store.id,
  });

  return (
    <div className="flex items-center space-x-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary">
              Ordenes: {Intl.NumberFormat("es-CO").format(+overview.orders)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cantidad de ordenes entregadas</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary">
              Clientes: {Intl.NumberFormat("es-CO").format(+overview.customers)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cantidad de clientes atendidos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary">
              Ingresos:{" "}
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(+overview.revenue)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ingresos generados por las ordenes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary">
              Productos: {Intl.NumberFormat("es-CO").format(+overview.products)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Products entregados</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <PopoverTrigger>
          <Info className="h-4 w-4" />
        </PopoverTrigger>
        <PopoverContent>
          <span className="text-sm text-muted-foreground">
            Información general de las ordenes registradas en el mes de{" "}
            {Intl.DateTimeFormat("es-CO", {
              month: "long",
            }).format(new Date())}
            .
          </span>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OrdersOverview;