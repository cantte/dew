import { CircleUserRound, Settings } from 'lucide-react'
import Link from 'next/link'
import SignOutButton from '~/components/signout-button'
import { ThemeToggle } from '~/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Skeleton } from '~/components/ui/skeleton'
import { getServerAuthSession } from '~/server/auth'

export const AccountNav = async () => {
  const session = await getServerAuthSession()

  if (!session) {
    return null
  }

  const user = session.user

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" size="icon" variant="ghost">
          <Avatar className="h-8 w-8">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name ?? 'D'} />
            ) : (
              <AvatarFallback>
                <span className="sr-only">{user.name ?? 'D'}</span>
                <CircleUserRound className="h-4 w-4" />
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col space-y-1">
          <span>Tu cuenta</span>
          <span className="font-light text-muted-foreground text-xs">
            {user.name}
          </span>
          <span className="font-light text-muted-foreground text-xs">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ThemeToggle />

        <Link href="/dashboard/account">
          <DropdownMenuItem className="flex items-center justify-between px-4 font-medium text-xs">
            <span>Preferencias</span>

            <Settings className="h-3 w-3" />
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const AccountNavFallback = () => {
  return (
    <Button className="rounded-full" size="icon" variant="ghost" disabled>
      <Skeleton className="h-8 w-8 rounded-full" />
    </Button>
  )
}
