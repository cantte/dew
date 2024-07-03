'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { getIcon } from '~/constants/icons'
import { cn } from '~/lib/utils'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  items: RouterOutputs['menu']['list']
}

const DashboardClientSidebar = ({ items }: Props) => {
  const pathname = usePathname()

  return items.length > 0 ? (
    <>
      {items.map((item) => {
        return (
          <Button
            key={`${item.id}`}
            asChild
            variant="ghost"
            className={cn(
              'flex w-full items-center justify-start gap-3 transition-all hover:bg-background',
              pathname === item.href
                ? 'bg-accent font-medium text-foreground hover:bg-accent'
                : 'text-muted-foreground',
            )}
          >
            <Link href={item.href ?? '#'}>
              {item.icon && getIcon(item.icon, 'h-4 w-4')}
              <span>{item.title}</span>
            </Link>
          </Button>
        )
      })}
    </>
  ) : null
}

export default DashboardClientSidebar
