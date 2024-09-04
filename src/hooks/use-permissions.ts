import { create } from 'zustand'

type Store = {
  permissions: string[]
  setPermissions: (permissions: string[]) => void
  hasPermissions: (permissions: string[]) => boolean
}

export const usePermissions = create<Store>((set, get) => ({
  permissions: [],
  setPermissions: (permissions) => set({ permissions }),
  hasPermissions: (permissions) =>
    permissions.every((permission) => get().permissions.includes(permission)),
}))
