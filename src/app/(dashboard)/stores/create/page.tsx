import { redirect } from "next/navigation";
import CreateStoreForm from "~/app/(dashboard)/stores/create/form";
import NotEnoughPermissions from "~/components/not-enough-permissions";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const CreateStorePage = async () => {
  const session = await getServerAuthSession();

  if (!session) {
    return redirect("/api/auth/signin");
  }

  const hasPermissions = await api.rbac.checkPermissions({
    permissions: ["store:create"],
  });

  if (!hasPermissions) {
    return <NotEnoughPermissions />;
  }

  return (
    <div className="w-full max-w-7xl">
      <CreateStoreForm />
    </div>
  );
};

export default CreateStorePage;
