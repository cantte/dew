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
      <div className="w-full max-w-7xl">
        <Alert>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            No se ha proporcionado un link de invitación válido.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const session = await getServerAuthSession();
  if (!session) {
    return redirect(
      `/api/auth/signin?callbackUrl=/stores/${params.id}/accept-invitation?employeeId=${employeeId as string}`,
    );
  }

  const store = await api.store.find({ id: params.id });
  if (!store) {
    return (
      <div className="w-full max-w-7xl">
        <Alert>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Tienda no encontrada.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const employee = await api.employee.findById({ code: employeeId as string });
  if (!employee) {
    return (
      <div className="w-full max-w-7xl">
        <Alert>
          <InfoIcon className="h-4 w-4 text-muted-foreground" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Empleado no encontrado.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl">
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
    </div>
  );
};

export default AcceptStoreInvitationPage;
