'use client'

import {
  Coins,
  Home,
  LayoutDashboard,
  Package,
  PieChart,
  ShoppingBasket,
  ShoppingCart,
  Store,
  Tag,
  Users,
} from 'lucide-react'

const icons = [
  {
    id: 'home',
    icon: Home,
  },
  {
    id: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'shopping-basket',
    icon: ShoppingBasket,
  },
  {
    id: 'shopping-cart',
    icon: ShoppingCart,
  },
  {
    id: 'package',
    icon: Package,
  },
  {
    id: 'coins',
    icon: Coins,
  },
  {
    id: 'store',
    icon: Store,
  },
  {
    id: 'users',
    icon: Users,
  },
  {
    id: 'pie-chart',
    icon: PieChart,
  },
  {
    id: 'tag',
    icon: Tag,
  },
]

export const getIcon = (id: string, className?: string) => {
  if (!id) return null

  const icon = icons.find((icon) => icon.id === id)

  if (!icon) return null

  return <icon.icon className={className} />
}
