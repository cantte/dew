'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { DropdownMenuItem } from '~/components/ui/dropdown-menu'

const SignOutButton = () => {
  return (
    <DropdownMenuItem onClick={() => signOut()}>
      <LogOut />
      Cerrar sesión
    </DropdownMenuItem>
  )
}

export default SignOutButton
