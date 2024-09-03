import { TriangleAlert } from 'lucide-react'
import NextLink from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'

export const NotActiveSubscription = () => {
  return (
    <Alert>
      <div className="flex items-center space-x-2">
        <span className="rounded-full bg-warning/10 p-1">
          <TriangleAlert className="size-3 text-warning" />
        </span>
        <AlertTitle className="mb-0">Suscripción no activa</AlertTitle>
      </div>
      <AlertDescription className="mt-2">
        <div className="grid gap-4">
          <span>
            No tiene una suscripción activa o en periodo de prueba. Por favor,
            active una suscripción para continuar.
          </span>

          <div>
            <Button asChild>
              <NextLink href={`/dashboard/account`}>
                Ir a configuración de cuenta
              </NextLink>
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
