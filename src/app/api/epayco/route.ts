import { type NextRequest, NextResponse } from 'next/server'
import { createWebhookEvent } from '~/server/api/routers/webhooks/create'
import { createTRPCContext } from '~/server/api/trpc'

const handler = async (req: NextRequest) => {
  try {
    const formData = await req.formData()
    const bodyStr = JSON.stringify(Object.fromEntries(formData))

    const trpcContext = await createTRPCContext({
      headers: req.headers,
    })

    await createWebhookEvent({
      ctx: trpcContext,
      input: {
        name: 'epayco-subscription-confirmation',
        body: bodyStr,
      },
    })
  } catch (error) {
    console.error('epayco error -->', error)
  }

  return NextResponse.json({ message: 'Hello from epayco' }, { status: 200 })
}

export { handler as GET, handler as POST }
