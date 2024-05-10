import React from "react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { RouterOutputs } from "~/trpc/shared";

type Props = {
  overview: NonNullable<RouterOutputs["product"]["overview"]>;
};

const ProductsOverview = ({ overview }: Props) => {
  return (
    <div className="flex items-center space-x-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary">
              Productos: {Intl.NumberFormat("es-CO").format(overview.products)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Cantidad de productos registrados</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary">
              Valor total:{" "}
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(overview.value)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Valor total del inventario de productos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary">
              Costo total:{" "}
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(overview.cost)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Costo total del inventario de productos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary">
              Utilidad:{" "}
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(overview.value - overview.cost)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Utilidad total del inventario de productos</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ProductsOverview;
