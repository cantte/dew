'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Dispatch, SetStateAction } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'
import { getIcon } from '~/constants/icons'
import { useSidebar } from '~/hooks/use-sidebar'
import { cn } from '~/lib/utils'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  items: RouterOutputs['menu']['list']
  setOpen?: Dispatch<SetStateAction<boolean>>
  isMobileNav?: boolean
}

export const DashboardNav = ({ items, setOpen, isMobileNav }: Props) => {
  const pathname = usePathname()
  const { isMinimized } = useSidebar()

  if (!items.length) {
    return null
  }

  const isExpanded = isMobileNav || (!isMinimized && !isMobileNav)

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          return (
            item.href && (
              <Tooltip key={`${item.id}-${index}`}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 overflow-hidden rounded-md py-2 font-light text-sm hover:bg-accent hover:text-accent-foreground',
                      pathname === item.href ? 'bg-accent' : 'transparent',
                      isExpanded ? 'justify-start' : 'justify-center',
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false)
                    }}
                  >
                    {item.icon &&
                      getIcon(
                        item.icon,
                        cn('size-4', isExpanded ? 'ml-3' : 'ml-0'),
                      )}

                    {isExpanded ? (
                      <span className="mr-2 truncate">{item.title}</span>
                    ) : (
                      ''
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? 'hidden' : 'inline-block'}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          )
        })}
      </TooltipProvider>
    </nav>
  )
}
