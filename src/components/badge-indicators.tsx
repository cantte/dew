import { Info } from 'lucide-react'
import { Badge } from '~/components/ui/badge'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'

type Indicator = {
  title: string
  tooltip: string
  value: string
}

type Props = {
  indicators: Indicator[]

  info?: string
}

const BadgeIndicators = ({ indicators, info }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {indicators.map((indicator) => (
        <TooltipProvider key={`${indicator.title}-${indicator.value}`}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="col-span-1">
                {indicator.title}: {indicator.value}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{indicator.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}

      {info && (
        <Popover>
          <PopoverTrigger>
            <Info className="h-4 w-4" />
          </PopoverTrigger>
          <PopoverContent>
            <span className="text-muted-foreground text-sm">{info}</span>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default BadgeIndicators
