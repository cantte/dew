'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import type { SidebarNavItem } from '~/types/nav'

type Props = {
  items: SidebarNavItem[]
}

const DashboardSidebar = ({ items }: Props) => {
  const pathname = usePathname()

  return items.length > 0 ? (
    <>
      {items.map((item, index) => {
        if (item.items === undefined && item.href !== undefined) {
          return (
            <Button
              key={`${index}-${item.href}`}
              asChild
              variant="ghost"
              className={cn(
                'flex w-full items-center justify-start gap-3 transition-all hover:bg-background',
                pathname === item.href
                  ? 'bg-accent font-medium text-foreground hover:bg-accent'
                  : 'text-muted-foreground',
              )}
            >
              <Link href={item.href}>
                {item.icon}
                <span>{item.title}</span>
              </Link>
            </Button>
          )
        }
        return (
          <div key={`${index}-${item.title}`} className={cn('pb-4')}>
            <h4 className="mb-1 rounded-md px-2 py-1 font-semibold text-sm">
              {item.title}
            </h4>
            {item?.items?.length && (
              <DashboardSidebarItem items={item.items} pathname={pathname} />
            )}
          </div>
        )
      })}
    </>
  ) : null
}

type DashboardSidebarItemProps = {
  items: SidebarNavItem[]
  pathname: string | null
}

export const DashboardSidebarItem = ({
  items,
  pathname,
}: DashboardSidebarItemProps) => {
  return items.length > 0 ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={`${index}-${item.href}`}
            href={item.href}
            className={cn(
              'group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:underline',
              item.disabled && 'cursor-not-allowed opacity-60',
              pathname === item.href
                ? 'font-medium text-foreground'
                : 'text-muted-foreground',
            )}
          >
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-[#adfa1d] px-1.5 py-0.5 text-[#000000] text-xs leading-none no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={`${index}-${item.title}`}
            className={cn(
              'flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground hover:underline',
              item.disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            {item.title}
            {item.label && (
              <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-muted-foreground text-xs leading-none no-underline group-hover:no-underline">
                {item.label}
              </span>
            )}
          </span>
        ),
      )}
    </div>
  ) : null
}

export default DashboardSidebar
