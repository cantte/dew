import {
    Coins,
    Home,
    Package,
    ShoppingBasket,
    ShoppingCart,
    Store,
    Users,
} from 'lucide-react'

const icons = [
  {
    id: 'home',
    icon: Home,
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
]

export const getIcon = (id: string) => {
  const icon = icons.find((icon) => icon.id === id)
  return icon?.icon ?? null
}
