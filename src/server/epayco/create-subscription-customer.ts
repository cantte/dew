import { EPAYCO_APIFY_URL } from '~/server/epayco/constants'
import { ePaycoLoginApify } from '~/server/epayco/login-apify'
import type {
  EpaycoCreateCustomerParams,
  EpaycoCreateCustomerResponse,
} from '~/types/epayco'

export const ePaycoCreateSubscriptionCustomer = async (
  params: EpaycoCreateCustomerParams,
) => {
  const loginResponse = await ePaycoLoginApify()

  if (!loginResponse.token) {
    throw new Error('Error fetching ePayCo login')
  }

  const customersResponse = await fetch(`${EPAYCO_APIFY_URL}/token/customer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginResponse.token}`,
    },
    body: JSON.stringify(params),
  })

  if (!customersResponse.ok) {
    throw new Error('Error fetching ePayCo customers')
  }

  return (await customersResponse.json()) as EpaycoCreateCustomerResponse
}
