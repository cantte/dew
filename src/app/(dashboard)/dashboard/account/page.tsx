import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import BackButton from '~/components/back-button'
import { CancelSubscriptionDialog } from '~/components/cancel-subscription.dialog'
import { UpdateStoreForm } from '~/components/stores/update-store.form'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { subscriptionStatuses } from '~/constants'
import { getServerAuthSession } from '~/server/auth'
import { formatToDateShort } from '~/text/format'
import { api } from '~/trpc/server'

export default async function AccountPage() {
  noStore()

  const session = await getServerAuthSession()

  if (!session) {
    return redirect('/api/auth/signin?callbackUrl=/dashboard/account')
  }

  const store = await api.store.findCurrent()

  if (!store) {
    return redirect('/dashboard')
  }

  const trial = await api.subscription.trial()
  const subscription = await api.subscription.find()

  const hasSubscription = subscription !== undefined

  return (
    <div className="grid gap-4">
      <div>
        <BackButton />
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Tu cuenta</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-1.5 text-muted-foreground text-sm">
                  <span>Nombre: {session.user.name}</span>

                  <span>Email: {session.user.email}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Tu subscripción</CardTitle>
              </CardHeader>

              <CardContent>
                {hasSubscription && (
                  <div className="grid gap-1.5 text-muted-foreground text-sm">
                    <span>
                      Estado:{' '}
                      {subscriptionStatuses.find(
                        (s) => s.id === subscription.status,
                      )?.label ?? 'Desconocido'}
                    </span>

                    <span>
                      Plan:{' '}
                      {subscription.planId === 'dew_mensual'
                        ? 'Mensual'
                        : 'Anual'}
                    </span>

                    <span>
                      Próximo pago:{' '}
                      {formatToDateShort('es-CO', subscription.periodEnd)}
                    </span>
                  </div>
                )}

                {!hasSubscription && (
                  <div className="text-muted-foreground text-sm">
                    {trial.isActive ? (
                      <span>
                        Subscripción de prueba activa, te quedan{' '}
                        {trial.daysLeft} días. Puedes adquirir un plan en
                        cualquier momento.
                      </span>
                    ) : (
                      <span>
                        No tienes una subscripción activa. Puedes adquirir un
                        plan en cualquier momento.
                      </span>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter>
                {!hasSubscription && (
                  <Button asChild>
                    <Link href="/dashboard/subscription/create">
                      Adquirir subscripción
                    </Link>
                  </Button>
                )}

                {hasSubscription && subscription.status === 'active' && (
                  <CancelSubscriptionDialog subscription={subscription} />
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Tu tienda</CardTitle>
              </CardHeader>

              <CardContent>
                <UpdateStoreForm store={store} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
