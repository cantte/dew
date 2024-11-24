import { redirect } from 'next/navigation'
import CreateStoreForm from '~/app/(dashboard)/stores/create/form'
import { auth } from '~/server/auth'

const CreateStorePage = async () => {
  const session = await auth()

  if (!session) {
    return redirect('/api/auth/signin')
  }

  return (
    <div className="w-full max-w-7xl">
      <CreateStoreForm />
    </div>
  )
}

export default CreateStorePage
