export const formatToCurrency = (locale: string, value: number) => {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'COP',
  }).format(value)
}

export const formatToNumber = (locale: string, value: number) => {
  return Intl.NumberFormat(locale).format(value)
}

export const formatToDateWithTime = (locale: string, date: Date) => {
  return Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)
}

export const formatToDateShort = (locale: string, date: Date) => {
  return Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export const formatToShortMonth = (locale: string, date: Date) => {
  return Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export const formatToMonthName = (locale: string, date: Date) => {
  return Intl.DateTimeFormat(locale, {
    month: 'long',
  }).format(date)
}
