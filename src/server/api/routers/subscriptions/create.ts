import { parse } from 'date-fns'
import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import { createUserPaymentInfo } from '~/server/api/routers/subscriptions/create-user-payment-info'
import { findUserPaymentInfo } from '~/server/api/routers/subscriptions/find-user-payment-info'
import type { createSubscriptionInput } from '~/server/api/schemas/subscriptions'
import { subscriptions } from '~/server/db/schema'
import { ePaycoChargeSubscription } from '~/server/epayco/charge-subscription'
import { ePaycoCreateSubscription } from '~/server/epayco/create-subscription'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createSubscriptionInput>
}

export const createSubscription = async ({ ctx, input }: Options) => {
  const ip = ctx.headers.get('x-forwarded-for') ?? ''
  const userId = ctx.session.user.id

  let userPayment = await findUserPaymentInfo({ ctx })

  if (!userPayment) {
    userPayment = await createUserPaymentInfo({ ctx, input })
  }

  if (!userPayment.customerId || !userPayment.cardToken) {
    throw new Error('Failed to create user payment info')
  }

  const createSubscriptionResponse = await ePaycoCreateSubscription({
    id_plan: input.planId,
    customer: userPayment.customerId,
    token_card: userPayment.cardToken,
    doc_type: input.customer.docType,
    doc_number: input.customer.docNumber,

    url_confirmation: `${process.env.NEXT_PUBLIC_URL}/api/epayco`,
    method_confirmation: 'POST',
  })

  if (!createSubscriptionResponse.success) {
    throw new Error('Failed to create subscription')
  }

  const chargeSubscriptionResponse = await ePaycoChargeSubscription({
    id_plan: input.planId,
    customer: userPayment.customerId,
    token_card: userPayment.cardToken,
    doc_type: input.customer.docType,
    doc_number: input.customer.docNumber,
    ip,
  })

  if (!chargeSubscriptionResponse.success) {
    throw new Error('Failed to charge subscription')
  }

  await ctx.db.insert(subscriptions).values({
    id: uuid(),
    externalId: createSubscriptionResponse.id,
    status:
      chargeSubscriptionResponse.subscription.status === 'active'
        ? 'active'
        : 'inactive',
    // date format dd-mm-yyyy
    periodEnd: parse(
      chargeSubscriptionResponse.subscription.periodEnd,
      'dd-MM-yyyy',
      new Date(),
    ),
    planId: input.planId,
    userId,
  })
}
