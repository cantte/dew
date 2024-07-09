import type { ReactNode } from 'react'
import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'

type Props = {
  title: string
  children: ReactNode
}

export const Tooltip = ({ title, children }: Props) => {
  return (
    <TooltipProvider>
      <TooltipComponent>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </TooltipComponent>
    </TooltipProvider>
  )
}
