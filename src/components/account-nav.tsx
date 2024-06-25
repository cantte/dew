import { CircleUserRound } from 'lucide-react'
import type { User } from 'next-auth'
import SignOutButton from '~/components/signout-button'
import { ThemeToggle } from '~/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

type Props = {
  user: User
}

const AccountNav = ({ user }: Props) => {
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
          <span>Mi cuenta</span>
          <span className="text-xs font-light text-muted-foreground">
            {user.name}
          </span>
          <span className="text-xs font-light text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <ThemeToggle />

        <DropdownMenuSeparator />

        <SignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountNav
