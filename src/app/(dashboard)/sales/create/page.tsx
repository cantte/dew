import { redirect } from "next/navigation";
import CreateSaleForm from "~/app/(dashboard)/sales/create/form";
import BackButton from "~/components/back-button";
import { api } from "~/trpc/server";

const CreateSalePage = async () => {
  const userPreferences = await api.userPreference.find.query();
  if (userPreferences === undefined) {
    return redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-4 mt-4 md:mt-0">
        <BackButton />
      </div>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Crear venta</h1>

        <CreateSaleForm storeId={userPreferences.storeId} />
      </section>
    </div>
  );
};

export default CreateSalePage;
