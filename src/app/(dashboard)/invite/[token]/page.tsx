import { redirect } from 'next/navigation'
import DefaultLayout from '~/components/default-layout'
import { Button } from '~/components/ui/button'
import { getServerAuthSession } from '~/server/auth'

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

  return (
    <DefaultLayout>
      <div className="flex min-h-[calc(100vh-10rem)] w-full flex-col items-center gap-4">
        <div className="mx-auto my-auto flex flex-col gap-4 rounded border p-4">
          <div className="flex flex-col gap-2">
            <h1 className="scroll-m-20 font-semibold text-xl tracking-tight">
              Hola, has sido invitado a la tienda.
            </h1>
            <p>
              Has sido invitado a la tienda en Dew. Para acceder a la tienda,
              haz clic en el siguiente botón:
            </p>
          </div>

          <Button>Aceptar invitación</Button>
        </div>
      </div>
    </DefaultLayout>
  )
}
