import {
  type ColumnDef,
  getCoreRowModel,
  getFacetedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import DataTable from "~/components/data-table";
import type { RouterOutputs } from "~/trpc/shared";

type Props = {
  mostSoldProducts: RouterOutputs["sale"]["mostSoldProducts"];
};

type MostSoldProduct = RouterOutputs["sale"]["mostSoldProducts"][number];

const columns: ColumnDef<MostSoldProduct>[] = [
  {
    header: "Producto",
    accessorKey: "name",
  },
  {
    header: "Volumen de ventas",
    accessorKey: "quantity",
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat("es-CO").format(+(row.original.quantity ?? 0))}
        </span>
      );
    },
  },
  {
    header: "Ingresos",
    accessorKey: "amount",
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(+(row.original.amount ?? 0))}
        </span>
      );
    },
  },
  {
    header: "Ganancias",
    accessorKey: "profit",
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
          }).format(+(row.original.profit ?? 0))}
        </span>
      );
    },
  },
];

const MostSoldProducts = ({ mostSoldProducts }: Props) => {
  const table = useReactTable<MostSoldProduct>({
    data: mostSoldProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  });

  return (
    <div className="flex flex-col space-y-2">
      <span className="font-semibold tracking-tight">
        Productos más vendidos
      </span>
      <div>
        {mostSoldProducts.length > 0 ? (
          <DataTable table={table} />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-2xl font-semibold">No hay productos</h3>
            <p className="text-gray-500">No se han vendido productos aún</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MostSoldProducts;
