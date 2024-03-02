import { redirect } from "next/navigation";
import CreateProductForm from "~/app/(dashboard)/products/create/form";
import BackButton from "~/components/back-button";
import { getServerAuthSession } from "~/server/auth";

export default async function CreateProductPage() {
  const session = await getServerAuthSession();

  if (session === null) {
    return redirect("/api/auth/signin");
  }

  return (
    <div>
      <div className="mb-4 mt-4 md:mt-0">
        <BackButton />
      </div>

      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Crear producto</h1>

        <CreateProductForm />
      </section>
    </div>
  );
}
