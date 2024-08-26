import { usePathname, useRouter } from 'next/navigation'
import { create } from 'zustand'

type Store = {
  year: number
  month: number
  setYear: (year: number) => void
  setMonth: (month: number) => void
}

const yearMonthFilter = create<Store>((set) => ({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  setYear: (year) => set({ year }),
  setMonth: (month) => set({ month }),
}))

export const useYearMonthFilter = () => {
  const store = yearMonthFilter()

  const router = useRouter()
  const pathname = usePathname()

  const setYear = (year: number) => {
    store.setYear(year)
    router.push(`${pathname}?year=${year}&month=${store.month}`)
  }

  const setMonth = (month: number) => {
    store.setMonth(month)
    router.push(`${pathname}?year=${store.year}&month=${month}`)
  }

  return {
    year: store.year,
    month: store.month,
    setYear,
    setMonth,
  }
}
