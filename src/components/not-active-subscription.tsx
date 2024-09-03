import { Info } from 'lucide-react'
import NextLink from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'

export const NotActiveSubscription = () => {
  return (
    <Alert>
      <Info className="h-4 w-4 text-muted-foreground" />
      <AlertTitle>Suscripción no activa</AlertTitle>
      <AlertDescription>
        No tiene una suscripción activa o en periodo de prueba. Por favor,
        active una suscripción para continuar.
        <br />
        <Button asChild size="sm" className="mt-2">
          <NextLink href={`/dashboard/account`}>
            Ir a configuración de cuenta
          </NextLink>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
