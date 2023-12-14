import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import { Badge } from "~/components/ui/badge";
import CreateProductForm from "~/app/(dashboard)/products/create/form";
import BackButton from "~/components/back-button";
import Footer from "~/components/footer";

export default async function CreateProductPage() {
  const session = await getServerAuthSession();

  if (session === null) {
    return redirect("/api/auth/signin");
  }

  return (
    <main className="h-screen-ios relative z-20 mx-auto flex h-screen max-w-7xl flex-col justify-between overflow-x-hidden px-4">
      <header className="flex h-[80px] items-center justify-between md:h-[100px]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">dew</span>
          <Badge>alfa</Badge>
        </div>
      </header>

      <section className="mb-4">
        <div className="mb-4 mt-4 md:mt-0">
          <BackButton />
        </div>

        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Crear producto</h1>

          <CreateProductForm />
        </section>
      </section>

      <Footer />
    </main>
  );
}
