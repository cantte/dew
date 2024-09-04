import { create } from 'zustand'

type Store = {
  permissions: string[]
  setPermissions: (permissions: string[]) => void
  hasPermissions: (permissions: string[]) => boolean
}

export const usePermissions = create<Store>((set) => ({
  permissions: [],
  setPermissions: (permissions) => set({ permissions }),
  hasPermissions: (permissions) =>
    permissions.every((permission) => permissions.includes(permission)),
}))
