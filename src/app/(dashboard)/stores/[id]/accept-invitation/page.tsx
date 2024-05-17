import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import AcceptStoreInvitation from "~/app/(dashboard)/stores/[id]/accept-invitation/accept-invitation";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

type Props = {
  params: {
    id: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

const AcceptStoreInvitationPage = async ({ params, searchParams }: Props) => {
  const employeeId = searchParams?.employeeId;
  if (!employeeId) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4 text-muted-foreground" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          No se ha proporcionado un link de invitación válido.
        </AlertDescription>
      </Alert>
    );
  }

  const session = await getServerAuthSession();
  if (session === null) {
    return redirect(
      `/api/auth/signin?callbackUrl=/stores/${params.id}/accept-invitation?employeeId=${employeeId as string}`,
    );
  }

  const store = await api.store.find({ id: params.id });
  if (!store) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4 text-muted-foreground" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Tienda no encontrada.</AlertDescription>
      </Alert>
    );
  }

  const employee = await api.employee.find({ id: employeeId as string });
  if (!employee) {
    return (
      <Alert>
        <InfoIcon className="h-4 w-4 text-muted-foreground" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Empleado no encontrado.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Aceptar invitación
        </h3>
        <p className="leading-7 text-muted-foreground">
          Has sido invitado a la tienda <strong>{store.name}</strong> como{" "}
          <strong>{employee.name}</strong>.
        </p>
      </div>

      <small className="text-muted-foreground">
        Al aceptar la invitación, se vinculará tu cuenta a la tienda.
      </small>

      <AcceptStoreInvitation
        storeId={params.id}
        employeeId={employeeId as string}
      />
    </div>
  );
};

export default AcceptStoreInvitationPage;
