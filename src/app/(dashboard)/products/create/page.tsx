import { InfoCircledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreateProductForm from "~/app/(dashboard)/products/create/form";
import BackButton from "~/components/back-button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

const CreateProductPage = async () => {
  const session = await getServerAuthSession();

  if (session === null) {
    return redirect("/api/auth/signin");
  }

  const userPreferences = await api.userPreference.find();
  const store =
    userPreferences !== undefined
      ? await api.store.find({ id: userPreferences.storeId })
      : undefined;

  if (!store) {
    return (
      <div className="space-y-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Crear producto
        </h3>

        <Alert>
          <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
          <AlertTitle>Acción requerida</AlertTitle>
          <AlertDescription>
            No ha registrado una tienda, por favor cree una tienda para poder
            continuar.
            <br />
            <Button asChild size="sm" className="mt-2">
              <Link href={`/stores/create`}>Crear tienda</Link>
            </Button>
          </AlertDescription>
        </Alert>
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
