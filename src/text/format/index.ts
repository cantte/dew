export const toCurrency = (locale: string, value: number) => {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'COP',
  }).format(value)
}

export const toNumber = (locale: string, value: number) => {
  return Intl.NumberFormat(locale).format(value)
}

export const toFullDate = (locale: string, date: Date) => {
  return Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}

export const toShortDate = (locale: string, date: Date) => {
  return Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}
