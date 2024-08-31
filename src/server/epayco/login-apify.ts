import { EPAYCO_APIFY_URL } from '~/server/epayco/constants'
import type { EpaycoApifyLoginResponse } from '~/types/epayco'

export const ePaycoLoginApify = async () => {
  const apiKey = process.env.EPAYCO_API_KEY
  const privateKey = process.env.EPAYCO_PRIVATE_KEY

  if (!apiKey || !privateKey) {
    throw new Error('EPAYCO_API_KEY and EPAYCO_PRIVATE_KEY must be set')
  }

  const encoded = CryptoJS.enc.Utf8.parse(`${apiKey}:${privateKey}`)
  const token = CryptoJS.enc.Base64.stringify(encoded)

  const apiFyloginResponse = await fetch(`${EPAYCO_APIFY_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
  })

  if (!apiFyloginResponse.ok) {
    console.error('Error fetching ePayCo login', apiFyloginResponse)
    throw new Error('Error fetching ePayCo login')
  }

  return (await apiFyloginResponse.json()) as EpaycoApifyLoginResponse
}
