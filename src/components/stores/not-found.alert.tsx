import { Info } from 'lucide-react'
import NextLink from 'next/link'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'

const NotFoundStoreAlert = () => {
  return (
    <Alert>
      <Info className="h-4 w-4 text-muted-foreground" />
      <AlertTitle>Acción requerida</AlertTitle>
      <AlertDescription>
        No ha registrado una tienda, por favor agregue una tienda para poder
        continuar.
        <br />
        <Button asChild size="sm" className="mt-2">
          <NextLink href={`/stores/create`}>Agregar tienda</NextLink>
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export default NotFoundStoreAlert
