'use client'

import { ViewVerticalIcon } from '@radix-ui/react-icons'
import Link, { type LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { dashboardConfig } from '~/config/dashboard'
import { cn } from '~/lib/utils'

const MobileNav = () => {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <ViewVerticalIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-2">
            {dashboardConfig.mainNav.map((item, index) => {
              if (item.items === undefined && item.href !== undefined) {
                return (
                  <MobileLink
                    href={item.href}
                    key={`${item.href}-${index}`}
                    onOpenChange={setOpen}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        'flex w-full items-center justify-start gap-3 transition-all hover:bg-background',
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Button>
                  </MobileLink>
                )
              }

              return (
                <div
                  key={`${item.href}-${index}`}
                  className="flex flex-col space-y-3 pt-6"
                >
                  <h4 className="font-medium">{item.title}</h4>
                  {item?.items?.length &&
                    item.items.map((item) => (
                      <React.Fragment key={item.href}>
                        {!item.disabled &&
                          (item.href ? (
                            <MobileLink
                              href={item.href}
                              onOpenChange={setOpen}
                              className="text-muted-foreground"
                            >
                              {item.title}
                            </MobileLink>
                          ) : (
                            item.title
                          ))}
                      </React.Fragment>
                    ))}
                </div>
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

export default MobileNav
