import { redirect } from 'next/navigation'
import BackButton from '~/components/back-button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

export default async function AccountPage() {
  const session = await getServerAuthSession()

  if (!session) {
    return redirect('/api/auth/signin?callbackUrl=/dashboard/account')
  }

  const store = await api.store.findCurrent()

  if (!store) {
    return redirect('/dashboard')
  }

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
                <CardTitle>Mi cuenta</CardTitle>
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
                <CardTitle>Tienda</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-1.5 text-muted-foreground text-sm">
                  <span>Nombre: {store.name}</span>

                  <span>Dirección: {store.address}</span>

                  <span>Teléfono: {store.phone || 'N/A'}</span>

                  <span>NIT: {store.nit || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
