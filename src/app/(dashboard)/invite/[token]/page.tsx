import { FileWarning, LayoutDashboard } from 'lucide-react'
import NextLink from 'next/link'
import { redirect } from 'next/navigation'
import { AcceptInvitationButton } from '~/components/invite/accept-invitation-button'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

type Props = {
  params: {
    token: string
  }
}
export default async function StoreInvitationPage({ params }: Props) {
  const session = await getServerAuthSession()

  if (!session) {
    return redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(`/invite/${params.token}`)}`,
    )
  }

  const invitationLink = await api.employee.findInvitationLink({
    token: params.token,
  })

  if (!invitationLink) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <Alert className="max-w-sm">
          <AlertTitle className="flex items-center gap-1.5">
            <FileWarning className="size-4 text-muted-foreground" />
            <span>Error</span>
          </AlertTitle>
          <AlertDescription>
            La invitación ha expirado o ya ha sido utilizada.
            <br />
            <Button asChild size="sm" className="mt-4">
              <NextLink href={`/dashboard`}>
                <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
                <span className="whitespace-nowrap">
                  Volver al panel de control
                </span>
              </NextLink>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (invitationLink.employee.email !== session.user.email) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <Alert className="max-w-sm">
          <AlertTitle className="flex items-center gap-1.5">
            <FileWarning className="size-4 text-muted-foreground" />
            <span>Error</span>
          </AlertTitle>
          <AlertDescription>
            La invitación no corresponde a tu cuenta. El correo electrónico
            registrado en la invitación es{' '}
            <span className="font-medium">{invitationLink.employee.email}</span>
            .
            <br />
            <Button asChild size="sm" className="mt-4">
              <NextLink href={`/dashboard`}>
                <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
                <span className="whitespace-nowrap">
                  Volver al panel de control
                </span>
              </NextLink>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-sm overflow-hidden rounded border">
        <div className="space-y-6 p-8">
          <h1 className="text-center font-light text-3xl text-foreground">
            {invitationLink.store.name}
          </h1>
          <div className="mx-auto h-1 w-16 bg-gray-200"></div>
          <p className="text-center text-muted-foreground text-sm">
            Estimado{' '}
            <span className="font-medium">{invitationLink.employee.name}</span>,
          </p>
          <p className="text-center text-foreground text-sm">
            Has sido invitado a unirte a la tienda{' '}
            <span className="font-medium">{invitationLink.store.name}</span>.
          </p>

          <AcceptInvitationButton token={params.token} />
        </div>
      </div>
    </div>
  )
}
