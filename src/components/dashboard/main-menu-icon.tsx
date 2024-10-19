'use client'

import { getIcon } from '~/constants/icons'

type Props = {
  icon: string
}

export const MainMenuIcon = ({ icon }: Props) => {
  return <>{getIcon(icon)}</>
}
