import { EPAYCO_SECURE_URL } from '~/server/epayco/constants'
import { ePaycoLogin } from '~/server/epayco/login'
import type {
  EpaycoCreateSubscriptionParams,
  EpaycoCreateSubscriptionResponse,
} from '~/types/epayco'

export const ePaycoCreateSubscription = async (
  params: EpaycoCreateSubscriptionParams,
) => {
  const loginResponse = await ePaycoLogin()

  if (!loginResponse.status) {
    throw new Error('Error fetching ePayCo login')
  }

  const subscriptionResponse = await fetch(
    `${EPAYCO_SECURE_URL}/recurring/v1/subscription/create`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginResponse.bearer_token}`,
      },
      body: JSON.stringify(params),
    },
  )

  if (!subscriptionResponse.ok) {
    throw new Error('Error fetching ePayCo subscription')
  }

  return (await subscriptionResponse.json()) as EpaycoCreateSubscriptionResponse
}
