import { Info } from "lucide-react";
import NextLink from "next/link";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";

const NotEnoughPermissions = () => {
  return (
    <Alert>
      <Info className="h-4 w-4 text-muted-foreground" />
      <AlertTitle>Permisos insuficientes</AlertTitle>
      <AlertDescription>
        No tiene permisos suficientes para realizar esta acción.
        <br />
        <Button asChild size="sm" className="mt-2">
          <NextLink href={`/dashboard`}>Ir al panel de control</NextLink>
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default NotEnoughPermissions;
