import { EPAYCO_SECURE_URL } from '~/server/epayco/constants'
import { ePaycoLogin } from '~/server/epayco/login'
import type {
  EpaycoChargeSubscriptionParams,
  EpaycoChargeSubscriptionResponse,
} from '~/types/epayco'

export const ePaycoChargeSubscription = async (
  params: EpaycoChargeSubscriptionParams,
) => {
  const loginResponse = await ePaycoLogin()

  if (!loginResponse.status) {
    throw new Error('Error fetching ePayCo login')
  }

  const subscriptionResponse = await fetch(
    `${EPAYCO_SECURE_URL}/payment/v1/charge/subscription/create`,
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

  return (await subscriptionResponse.json()) as EpaycoChargeSubscriptionResponse
}
