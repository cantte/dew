import { EPAYCO_APIFY_URL } from '~/server/epayco/constants'
import { ePaycoLoginApify } from '~/server/epayco/login-apify'
import type {
  EpaycoCreateCardTokenParams,
  EpaycoCreateCardTokenResponse,
} from '~/types/epayco'

export const ePaycoCreateCardToken = async (
  params: EpaycoCreateCardTokenParams,
) => {
  const loginResponse = await ePaycoLoginApify()

  if (!loginResponse.token) {
    throw new Error('Error fetching ePayCo login')
  }

  const cardTokenResponse = await fetch(`${EPAYCO_APIFY_URL}/token/card`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginResponse.token}`,
    },
    body: JSON.stringify(params),
  })

  if (!cardTokenResponse.ok) {
    throw new Error('Error fetching ePayCo card token')
  }

  return (await cardTokenResponse.json()) as EpaycoCreateCardTokenResponse
}
