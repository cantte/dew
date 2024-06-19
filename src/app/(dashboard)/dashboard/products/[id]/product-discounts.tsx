import { api } from "~/trpc/server";

type Props = {
  id: string;
};

const ProductDiscounts = async ({ id }: Props) => {
  const discounts = await api.product.searchDiscounts({
    id: id,
  });

  return (
    <>
      <div className="font-semibold">Descuentos</div>

      {discounts.length === 0 ? (
        <div className="text-muted-foreground">No hay descuentos</div>
      ) : (
        <ul className="grid gap-2">
          {discounts.map((discount) => (
            <li key={discount.id} className="flex flex-col space-y-0.5">
              <div className="flex w-full items-center justify-between">
                <span className="text-muted-foreground">
                  {discount.isPercentage ? "Por porcentaje" : "Por valor"}
                </span>
                <span>
                  {discount.isPercentage
                    ? `${Intl.NumberFormat("es-CO", {
                        style: "percent",
                        minimumFractionDigits: 2,
                      }).format(discount.discount / 100)}`
                    : `${Intl.NumberFormat("es-CO", {
                        style: "currency",
                        currency: "COP",
                      }).format(discount.discount)}`}
                </span>
              </div>

              <div className="flex w-full items-center justify-between">
                <span></span>
                <small className="text-muted-foreground">
                  {Intl.DateTimeFormat("es-CO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(Date.parse(discount.startDate))}{" "}
                  -{" "}
                  {Intl.DateTimeFormat("es-CO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }).format(Date.parse(discount.endDate))}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default ProductDiscounts;
