import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'
import { NavButton } from '~/components/home/nav-button'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Dialog, DialogClose } from '~/components/ui/dialog'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '~/components/ui/navigation-menu'
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '~/components/ui/sheet'

export const MainNav = () => {
  return (
    <div className="flex items-center justify-between border-b p-2">
      <div className="flex w-full justify-between min-[825px]:hidden">
        <Dialog>
          <SheetTrigger className="p-2 transition">
            <Button
              size="icon"
              variant="ghost"
              className="size-4"
              aria-label="Open menu"
              asChild
            >
              <Menu />
            </Button>
          </SheetTrigger>

          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Dew</SheetTitle>
            </SheetHeader>

            <div className="mt-[1rem] flex flex-col space-y-3">
              <DialogClose asChild>
                <Link href="/">
                  <Button variant="ghost">Inicio</Button>
                </Link>
              </DialogClose>

              <DialogClose asChild>
                <Link href="/features">
                  <Button variant="ghost">Características</Button>
                </Link>
              </DialogClose>

              <DialogClose asChild>
                <Link href="/pricing">
                  <Button variant="ghost">Precios</Button>
                </Link>
              </DialogClose>

              <DialogClose asChild>
                <Link href="/faq">
                  <Button variant="ghost">FAQ</Button>
                </Link>
              </DialogClose>
            </div>
          </SheetContent>
        </Dialog>
      </div>
      <div className="hidden gap-4 md:flex">
        <NavigationMenu>
          <NavigationMenuList className="flex w-[100%] justify-between gap-3 max-[825px]:hidden">
            <Link
              href="/"
              className="mr-5 flex items-center gap-2 pl-2"
              aria-label="Home"
            >
              <span className="font-semibold text-lg">dew</span>
              <Badge>beta</Badge>
            </Link>
          </NavigationMenuList>

          <NavigationMenuList>
            <NavigationMenuItem>
              <Button variant="ghost" asChild>
                <Link href="/features">Características</Link>
              </Button>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Button variant="ghost" asChild>
                <Link href="/pricing">Precios</Link>
              </Button>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Button variant="ghost" asChild>
                <Link href="/faq">FAQ</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <nav className="flex items-center gap-3">
        <Suspense fallback={null}>
          <NavButton />
        </Suspense>
      </nav>
    </div>
  )
}
