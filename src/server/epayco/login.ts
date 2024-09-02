import CryptoJS from 'crypto-js'
import { EPAYCO_SECURE_URL } from '~/server/epayco/constants'
import type { EpaycoLoginResponse } from '~/types/epayco'

export const ePaycoLogin = async () => {
  const apiKey = process.env.EPAYCO_API_KEY
  const privateKey = process.env.EPAYCO_PRIVATE_KEY

  if (!apiKey || !privateKey) {
    throw new Error('EPAYCO_API_KEY and EPAYCO_PRIVATE_KEY must be set')
  }

  const encoded = CryptoJS.enc.Utf8.parse(`${apiKey}:${privateKey}`)
  const token = CryptoJS.enc.Base64.stringify(encoded)

  const loginResponse = await fetch(`${EPAYCO_SECURE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      public_key: apiKey,
      private_key: privateKey,
    }),
  })

  if (!loginResponse.ok) {
    console.error('Error fetching ePayCo login', loginResponse)
    throw new Error('Error fetching ePayCo login')
  }

  return (await loginResponse.json()) as EpaycoLoginResponse
}
