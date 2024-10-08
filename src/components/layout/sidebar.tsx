'use client'

import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { DashboardNav } from '~/components/dashboard/nav'
import { Button } from '~/components/ui/button'
import { useSidebar } from '~/hooks/use-sidebar'
import { cn } from '~/lib/utils'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  items: RouterOutputs['menu']['list']
  className?: string
}

export const Sidebar = ({ className, items }: Props) => {
  const { isMinimized, toggle } = useSidebar()
  const [status, setStatus] = useState(false)

  const handleToggle = () => {
    setStatus(true)
    toggle()
    setTimeout(() => setStatus(false), 500)
  }

  return (
    <nav
      className={cn(
        'relative z-10 hidden h-screen flex-none border-r pt-20 md:block',
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[72px]',
        className,
      )}
    >
      <Button
        variant="outline"
        size="sm"
        className="-right-5 absolute top-16 h-7 gap-1 bg-background"
        onClick={handleToggle}
      >
        <ChevronLeft
          className={cn('h-3.5 w-3.5', isMinimized && 'rotate-180')}
        />
      </Button>

      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="mt-3 grid gap-1">
            <DashboardNav items={items} />
          </div>
        </div>
      </div>
    </nav>
  )
}
