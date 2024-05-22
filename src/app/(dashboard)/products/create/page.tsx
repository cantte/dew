import { redirect } from "next/navigation";
import CreateProductForm from "~/app/(dashboard)/products/create/form";
import BackButton from "~/components/back-button";
import NotFoundStoreAlert from "~/components/stores/not-found.alert";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const CreateProductPage = async () => {
  const session = await getServerAuthSession();

  if (session === null) {
    return redirect("/api/auth/signin");
  }

  const store = await api.store.findCurrent();

  if (!store) {
    return (
      <div className="space-y-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Crear producto
        </h3>

        <NotFoundStoreAlert />
      </div>
    );
  }

  const stores = await api.store.list();

  return (
    <div>
      <div className="mb-4 mt-4 md:mt-0">
        <BackButton />
      </div>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Crear producto</h1>

        <CreateProductForm storeId={store.id} stores={stores} />
      </section>
    </div>
  );
};

export default CreateProductPage;
