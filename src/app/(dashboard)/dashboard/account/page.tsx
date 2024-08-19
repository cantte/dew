import { unstable_noStore as noStore } from 'next/cache'
import { redirect } from 'next/navigation'
import BackButton from '~/components/back-button'
import { UpdateStoreForm } from '~/components/stores/update-store.form'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
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
                <CardTitle className="text-xl">Tienda</CardTitle>
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
