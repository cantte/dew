import { redirect } from "next/navigation";
import CreateStoreForm from "~/app/(dashboard)/stores/create/form";
import { getServerAuthSession } from "~/server/auth";

const CreateStorePage = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/api/auth/signin");
  }

  return <CreateStoreForm />;
};

export default CreateStorePage;
