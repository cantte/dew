import type { ReactNode } from 'react'

export type NavItem = {
  title: string
  href?: string
  disabled?: boolean
  label?: string
  icon?: ReactNode
}

export type NavItemWithChildren = NavItem & {
  items?: NavItemWithChildren[]
}

export type MainNavItem = NavItem
export type SidebarNavItem = NavItemWithChildren
