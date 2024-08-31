export type EpaycoApifyLoginResponse = {
  token?: string
}

export type EpaycoLoginResponse = {
  status: boolean
  bearer_token: string
}

export type EpaycoCreateCardTokenParams = {
  cardNumber: string
  cardExpYear: string
  cardExpMonth: string
  cardCvc: string
}

export type EpaycoCreateCardTokenResponse = {
  success: boolean

  data: {
    id: string
  }
}

export type EpaycoCreateCustomerParams = {
  docType: string
  docNumber: string
  name: string
  lastName: string
  email: string
  phone: string
  cardTokenId: string
}

export type EpaycoCreateCustomerResponse = {
  success: boolean

  data: {
    data: {
      customerId: string
    }
  }
}

export type EpaycoCreateSubscriptionParams = {
  id_plan: string
  customer: string
  token_card: string
  doc_type: string
  doc_number: string

  url_confirmation?: string
  method_confirmation?: string
}

export type EpaycoCreateSubscriptionResponse = {
  status: boolean
  success: boolean

  id: string
  status_subscription: string
}

export type EpaycoChargeSubscriptionParams = {
  id_plan: string
  customer: string
  token_card: string
  doc_type: string
  doc_number: string
  ip: string
}

export type EpaycoChargeSubscriptionResponse = {
  success: boolean

  subscription: {
    status: string
    periodEnd: string
    nextVerificationDate: string
  }
}
