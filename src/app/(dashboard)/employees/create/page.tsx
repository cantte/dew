import { redirect } from "next/navigation";
import CreateEmployeeForm from "~/app/(dashboard)/employees/create/form";
import BackButton from "~/components/back-button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const CreateEmployeePage = async () => {
  const session = await getServerAuthSession();
  if (session === null) {
    return redirect("/api/auth/signin");
  }

  const userPreferences = await api.userPreference.find.query();
  if (userPreferences === undefined) {
    return redirect("/dashboard");
  }

  const store = await api.store.find.query({
    id: userPreferences.storeId,
  });
  if (store === undefined) {
    return redirect("/dashboard");
  }

  return (
    <div>
      <div className="mb-4 mt-4 md:mt-0">
        <BackButton />
      </div>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Crear empleado</h1>

        <CreateEmployeeForm storeId={store.id} />
      </section>
    </div>
  );
};

export default CreateEmployeePage;
