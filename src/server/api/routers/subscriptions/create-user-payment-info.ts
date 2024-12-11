import assert from 'assert'
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
  const [expMonth, expYear] = input.card.expiryDate.split('/')
  const sanitizedCardNumber = input.card.number.replaceAll(' ', '')

  assert(expMonth !== undefined, 'Invalid expiry month')
  assert(expYear !== undefined, 'Invalid expiry year')

  const createCardResponse = await ePaycoCreateCardToken({
    cardNumber: sanitizedCardNumber,
    cardCvc: input.card.cvc,
    cardExpMonth: expMonth.trim(),
    cardExpYear: `20${expYear.trim()}`,
  })

  if (!createCardResponse.success) {
    console.error(
      `[ERROR]: Failed to create card token: ${JSON.stringify(createCardResponse)}`,
    )

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
    cellPhone: input.customer.phone,
    cardTokenId,
  })

  if (!createCustomerResponse.success) {
    console.error(
      `[ERROR]: Failed to create customer: ${JSON.stringify(createCustomerResponse)}`,
    )

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
