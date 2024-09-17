'use client'

import { Menu } from 'lucide-react'
import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { getIcon } from '~/constants/icons'
import { cn } from '~/lib/utils'
import type { RouterOutputs } from '~/trpc/shared'

type Props = {
  items: RouterOutputs['menu']['list']
}

export const MobileNavClient = ({ items }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-2">
            {items.map((item, index) => {
              return (
                <MobileLink
                  href={item.href ?? '#'}
                  key={`${item.href}-${index}`}
                  onOpenChange={setOpen}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      'flex w-full items-center justify-start gap-3 transition-all hover:bg-background',
                    )}
                  >
                    {item.icon && getIcon(item.icon, 'h-4 w-4')}
                    <span>{item.title}</span>
                  </Button>
                </MobileLink>
              )
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

type MobileLinkProps = LinkProps & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

const MobileLink = ({
  href,
  onOpenChange,
  children,
  className,
  ...props
}: MobileLinkProps) => {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
