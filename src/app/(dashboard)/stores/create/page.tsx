import { redirect } from "next/navigation";
import CreateStoreForm from "~/app/(dashboard)/stores/create/form";
import { api } from "~/trpc/server";

const CreateStorePage = async () => {
  const userPreferences = await api.userPreference.find();
  const store = await api.store.find({
    id: userPreferences?.storeId ?? "0",
  });
  if (store !== undefined) {
    return redirect("/dashboard");
  }

  return <CreateStoreForm />;
};

export default CreateStorePage;
