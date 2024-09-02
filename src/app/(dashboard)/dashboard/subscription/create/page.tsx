import { redirect } from 'next/navigation'
import { CreateSubscriptionForm } from '~/app/(dashboard)/dashboard/subscription/create/form'
import BackButton from '~/components/back-button'
import NotFoundStoreAlert from '~/components/stores/not-found.alert'
import { getServerAuthSession } from '~/server/auth'
import { api } from '~/trpc/server'

export default async function CreateSubscriptionPage() {
  const session = await getServerAuthSession()

  if (!session) {
    return redirect('/api/auth/signin')
  }

  const store = await api.store.findCurrent()

  if (!store) {
    return <NotFoundStoreAlert />
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <BackButton />

      <CreateSubscriptionForm store={store} email={session.user.email ?? ''} />
    </div>
  )
}
