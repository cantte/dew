import { EPAYCO_SECURE_URL } from '~/server/epayco/constants'
import { ePaycoLogin } from '~/server/epayco/login'
import type {
  EpaycoCancelSubscriptionParams,
  EpaycoCancelSubscriptionResponse,
} from '~/types/epayco'

export const ePaycoCancelSubscription = async (
  params: EpaycoCancelSubscriptionParams,
) => {
  const loginResponse = await ePaycoLogin()

  if (!loginResponse.status) {
    throw new Error('Error fetching ePayCo login')
  }

  const cancelSubscriptionResponse = await fetch(
    `${EPAYCO_SECURE_URL}/recurring/v1/subscription/cancel`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${loginResponse.bearer_token}`,
      },
      body: JSON.stringify(params),
    },
  )

  if (!cancelSubscriptionResponse.ok) {
    throw new Error('Error fetching ePayCo cancel subscription')
  }

  return (await cancelSubscriptionResponse.json()) as EpaycoCancelSubscriptionResponse
}
