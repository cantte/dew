import { api } from "~/trpc/server";

type Props = {
  id: string;
};

const ProductSummary = async ({ id }: Props) => {
  const summary = await api.product.searchSummary({ id: id });

  return (
    <>
      <div className="font-semibold">Ventas</div>

      <ul className="grid gap-2">
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Cantidad vendida</span>
          <span>{Intl.NumberFormat("es-CO").format(summary?.sales ?? 0)}</span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Total vendido</span>
          <span>
            {Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
            }).format(summary?.amount ?? 0)}
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span className="text-muted-foreground">Ganancias generadas</span>
          <span>
            {Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
            }).format(summary?.profit ?? 0)}
          </span>
        </li>
      </ul>
    </>
  );
};

export default ProductSummary;
