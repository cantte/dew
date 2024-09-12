import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { createWebhookInput } from '~/server/api/schemas/webhooks'
import type { TRPCContextInner } from '~/server/api/trpc'
import { webhooksEvents } from '~/server/db/schema'

type Options = {
  ctx: TRPCContextInner
  input: TypeOf<typeof createWebhookInput>
}

export const createWebhookEvent = async ({ ctx, input }: Options) => {
  return await ctx.db.insert(webhooksEvents).values({
    id: uuid(),
    name: input.name,
    body: input.body,
  })
}
