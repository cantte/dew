import { redirect } from "next/navigation";
import EditProductForm from "~/app/(dashboard)/products/[id]/edit/form";
import MainShell from "~/components/main-shell";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

type Props = {
  params: {
    id: string;
  };
};

const EditProductPage = async ({ params }: Props) => {
  const session = await getServerAuthSession();
  if (session === null) {
    return redirect("/api/auth/signin");
  }

  const product = await api.product.findById.query({
    id: params.id,
  });

  if (product === null || product === undefined) {
    return redirect("/dashboard/products");
  }

  return (
    <MainShell title={`Editar producto ${product.name}`}>
      <EditProductForm product={product} />
    </MainShell>
  );
};

export default EditProductPage;
