import { redirect } from "next/navigation";
import React from "react";
import CreateStoreForm from "~/app/(dashboard)/stores/create/form";
import BackButton from "~/components/back-button";
import Footer from "~/components/footer";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/server";

const CreateStorePage = async () => {
  const userPreferences = await api.userPreference.find.query();
  const store = await api.store.find.query({
    id: userPreferences?.storeId ?? "0",
  });
  if (store !== undefined) {
    return redirect("/dashboard");
  }

  return (
    <main className="h-screen-ios relative z-20 mx-auto flex h-screen max-w-7xl flex-col justify-between overflow-x-hidden px-4">
      <header className="flex h-[80px] items-center justify-between md:h-[100px]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold">dew</span>
          <Badge>beta</Badge>
        </div>
      </header>

      <section className="mb-4">
        <div className="mb-4 mt-4 md:mt-0">
          <BackButton />
        </div>

        <section className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Crear tienda</h1>

          <CreateStoreForm />
        </section>
      </section>

      <Footer />
    </main>
  );
};

export default CreateStorePage;
