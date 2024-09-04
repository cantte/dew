'use client'

import { useEffect } from 'react'
import { usePermissions } from '~/hooks/use-permissions'

type Props = {
  permissions: string[]
}

export const SetPermissions = ({ permissions }: Props) => {
  const { setPermissions } = usePermissions()

  // biome-ignore lint/correctness/useExhaustiveDependencies: not needed
  useEffect(() => {
    setPermissions(permissions)
  }, [permissions])

  return null
}
