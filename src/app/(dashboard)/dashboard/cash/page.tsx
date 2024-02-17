import { InfoCircledIcon } from "@radix-ui/react-icons";
import NextLink from "next/link";
import EnableCash from "~/app/(dashboard)/dashboard/cash/enable-cash";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";

const CashRegisterPage = async () => {
  const store = await api.store.find.query();
  if (!store) {
    return (
      <div className="space-y-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Caja registradora
        </h3>

        <Alert>
          <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
          <AlertTitle>Acción requerida</AlertTitle>
          <AlertDescription>
            No ha registrado una tienda, por favor cree una tienda para poder
            continuar.
            <br />
            <Button asChild size="sm" className="mt-2">
              <NextLink href={`/stores/create`}>Crear tienda</NextLink>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const cashRegister = await api.cashRegister.find.query({ storeId: store.id });
  if (!cashRegister) {
    return (
      <div className="space-y-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Caja registradora
        </h3>

        <Alert>
          <InfoCircledIcon className="h-4 w-4 text-muted-foreground" />
          <AlertTitle>Habilitar caja</AlertTitle>
          <AlertDescription>
            Actualmente no tienes esta funcionalidad activa.
            <br />
            <EnableCash storeId={store.id} />
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Caja registradora
      </h3>

      <Card className="border-dashed shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Estado de la caja registradora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
            }).format(+cashRegister.amount)}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-500">
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(+cashRegister.amount)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Egresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {Intl.NumberFormat("es-CO", {
                style: "currency",
                currency: "COP",
              }).format(+cashRegister.amount)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button size="sm" className="text-sm">
          Realizar ingreso
        </Button>
        <Button size="sm" className="text-sm" variant="outline">
          Realizar egreso
        </Button>
      </div>

      <Separator />

      <h2 className="text-lg font-semibold tracking-tight">Movimientos</h2>
    </div>
  );
};

export default CashRegisterPage;
