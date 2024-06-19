import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductSummary from "~/app/(dashboard)/dashboard/products/[id]/product-summary";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";

type Props = {
  id: string;
};

const ProductDetails = async ({ id }: Props) => {
  const product = await api.product.findById({ id: id });

  if (!product) {
    return notFound();
  }

  const stores = await api.product.stores({ id: id });

  return (
    <Card className="rounded shadow-none">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <span className="font-bold">{product.name}</span>
            <Badge variant="outline">{product.code}</Badge>
          </div>
        </CardTitle>

        <CardDescription>{product.description}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col justify-between gap-4">
          <div className="text-sm">
            <div className="grid gap-3">
              <div className="font-semibold">Tiendas</div>
              <div className="flex flex-row space-x-2">
                {stores.map((store) => (
                  <Badge key={store.id} variant="secondary">
                    {store.name}
                  </Badge>
                ))}
              </div>

              <div className="font-semibold">Precios</div>
              <ul className="grid gap-2">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Precio de compra
                  </span>
                  <span>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(product.purchasePrice)}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Precio de venta</span>
                  <span>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(product.salePrice)}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Ganancia estimada por unidad
                  </span>
                  <span>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(product.salePrice - product.purchasePrice)}
                  </span>
                </li>
              </ul>

              <Separator className="my-2" />

              <Suspense fallback={<ProductSummaryFallback />}>
                <ProductSummary id={id} />
              </Suspense>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProductSummaryFallback = () => {
  return (
    <>
      <div className="font-semibold">Ventas</div>

      <div className="flex flex-col items-start space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    </>
  );
};

export default ProductDetails;
