import type { TypeOf } from 'zod'
import uuid from '~/lib/uuid'
import type { TRPCAuthedContext } from '~/server/api/procedures/authed'
import type { createSubscriptionInput } from '~/server/api/schemas/subscriptions'
import { userPayments } from '~/server/db/schema'
import { ePaycoCreateCardToken } from '~/server/epayco/create-card-token'
import { ePaycoCreateSubscriptionCustomer } from '~/server/epayco/create-subscription-customer'

type Options = {
  ctx: TRPCAuthedContext
  input: TypeOf<typeof createSubscriptionInput>
}

export const createUserPaymentInfo = async ({ ctx, input }: Options) => {
  const createCardResponse = await ePaycoCreateCardToken({
    cardNumber: input.card.number,
    cardCvc: input.card.cvc,
    cardExpMonth: input.card.expMonth,
    cardExpYear: input.card.expYear,
  })

  if (!createCardResponse.success) {
    throw new Error('Failed to create card token')
  }

  const cardTokenId = createCardResponse.data.id

  const createCustomerResponse = await ePaycoCreateSubscriptionCustomer({
    docType: input.customer.docType,
    docNumber: input.customer.docNumber,
    name: input.customer.name,
    lastName: input.customer.lastName,
    email: input.customer.email,
    phone: input.customer.phone,
    cardTokenId,
  })

  if (!createCustomerResponse.success) {
    throw new Error('Failed to create customer')
  }

  const customerId = createCustomerResponse.data.data.customerId

  const userPayment = {
    id: uuid(),
    customerId,
    cardToken: cardTokenId,
  }

  await ctx.db.insert(userPayments).values({
    ...userPayment,
    userId: ctx.session.user.id,
  })

  return userPayment
}
