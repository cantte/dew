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
import type { RouterOutputs } from "~/trpc/shared";

type Props = {
  overview: NonNullable<RouterOutputs["sale"]["overview"]>;
};

const SalesOverview = ({ overview }: Props) => {
  return (
    <div className="flex items-center space-x-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary">
              Ventas: {Intl.NumberFormat("es-CO").format(+overview.sales)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cantidad de ventas registradas</p>
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
            <p>Ingresos generados por las ventas</p>
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
            <p>Products vendidos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Popover>
        <PopoverTrigger>
          <Info className="h-4 w-4" />
        </PopoverTrigger>
        <PopoverContent>
          <span className="text-sm text-muted-foreground">
            Información general de las ventas registradas en el mes de{" "}
            {Intl.DateTimeFormat("es-CO", {
              month: "long",
            }).format(new Date())}.
          </span>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SalesOverview;
