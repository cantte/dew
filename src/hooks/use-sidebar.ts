import { create } from 'zustand'

type Store = {
  isMinimized: boolean
  toggle: () => void
}

export const useSidebar = create<Store>((set) => ({
  isMinimized: false,
  toggle: () => set((state) => ({ isMinimized: !state.isMinimized })),
}))
