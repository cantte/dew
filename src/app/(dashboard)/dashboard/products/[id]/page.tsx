import { Suspense } from "react";
import ProductDetails from "~/app/(dashboard)/dashboard/products/[id]/product-details";
import ProductDiscounts from "~/app/(dashboard)/dashboard/products/[id]/product-discounts";
import ProductInventoryDetail from "~/app/(dashboard)/dashboard/products/[id]/product-inventory-detail";
import NotEnoughPermissions from "~/components/not-enough-permissions";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { api } from "~/trpc/server";

type Props = {
  params: {
    id: string;
  };
};

export const dynamic = "force-dynamic";

const ProductDetailPage = async ({ params }: Props) => {
  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ["product:view"],
  });

  if (!hasPermissions) {
    return <NotEnoughPermissions />;
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <div className="flex min-h-[calc(100vh-20rem)] w-full flex-col space-y-4">
        <div className="grid grow grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <Suspense fallback={<ProductDetailsFallback />}>
              <ProductDetails id={params.id} />
            </Suspense>
          </div>
          <div className="flex flex-col justify-between gap-4 rounded border p-4">
            <div className="text-sm">
              <div className="grid gap-3">
                <Suspense fallback={<ProductInventoryDetailFallback />}>
                  <ProductInventoryDetail id={params.id} />
                </Suspense>

                <Separator className="my-2" />

                <Suspense fallback={<ProductDiscountsFallback />}>
                  <ProductDiscounts id={params.id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetailsFallback = () => {
  return (
    <div className="flex flex-col items-start space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

const ProductInventoryDetailFallback = () => {
  return (
    <>
      <div className="font-semibold">Inventario</div>

      <div className="flex flex-col items-start space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    </>
  );
};

const ProductDiscountsFallback = () => {
  return (
    <>
      <div className="font-semibold">Descuentos</div>

      <div className="flex flex-col items-start space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-full" />
      </div>
    </>
  );
};

export default ProductDetailPage;
