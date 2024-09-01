import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import BackButton from '~/components/back-button'
import { UpdateStoreForm } from '~/components/stores/update-store.form'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { getServerAuthSession } from '~/server/auth'
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
                <CardTitle className="text-xl">Mi cuenta</CardTitle>
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
                <CardTitle className="text-xl">Mi subscripción</CardTitle>
              </CardHeader>

              <CardContent>
                {trial.isActive && (
                  <div className="grid gap-1.5 text-muted-foreground text-sm">
                    <span>
                      Subscripción de prueba activa, te quedan {trial.leftDays}{' '}
                      días de prueba.
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                {trial.isActive && (
                  <Button asChild>
                    <Link href="/dashboard/subscription/new">
                      Activar subscripción
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Mi tienda</CardTitle>
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
