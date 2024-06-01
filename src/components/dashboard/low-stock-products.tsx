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
  lowStockProducts: RouterOutputs["inventory"]["lowStock"];
};

type LowStockProduct = RouterOutputs["inventory"]["lowStock"][number];

const columns: ColumnDef<LowStockProduct>[] = [
  {
    header: "Producto",
    accessorKey: "name",
  },
  {
    header: "Cantidad",
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
    header: "Stock",
    accessorKey: "stock",
    cell: ({ row }) => {
      return (
        <span>
          {Intl.NumberFormat("es-CO").format(+(row.original.stock ?? 0))}
        </span>
      );
    },
  },
];

const LowStockProducts = ({ lowStockProducts }: Props) => {
  const table = useReactTable<LowStockProduct>({
    data: lowStockProducts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
  });

  return (
    <>
      {lowStockProducts.length > 0 && (
        <div className="flex flex-col space-y-2">
          <span className="font-semibold tracking-tight">
            Productos bajos en stock
          </span>

          <DataTable table={table} />
        </div>
      )}
    </>
  );
};

export default LowStockProducts;
