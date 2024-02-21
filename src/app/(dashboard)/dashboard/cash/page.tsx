import { InfoCircledIcon } from "@radix-ui/react-icons";
import { endOfDay, startOfDay } from "date-fns";
import NextLink from "next/link";
import CashRegisterDetails from "~/app/(dashboard)/dashboard/cash/details";
import EnableCash from "~/app/(dashboard)/dashboard/cash/enable-cash";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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

  const today = new Date();
  const transactions = await api.cashRegister.transactions.list.query({
    cashRegisterId: cashRegister.id,
    from: startOfDay(today),
    to: endOfDay(today),
  });

  return (
    <div className="flex h-[calc(100vh-5rem)] flex-col space-y-4">
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        Caja registradora
      </h3>

      <Card className="border-dashed shadow-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Saldo de la caja registradora
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

      <CashRegisterDetails
        transactions={transactions}
        cashRegisterId={cashRegister.id}
      />
    </div>
  );
};

export default CashRegisterPage;
