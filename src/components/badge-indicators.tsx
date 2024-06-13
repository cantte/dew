import { Info } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

type Indicator = {
  title: string;
  tooltip: string;
  value: string;
};

type Props = {
  indicators: Indicator[];

  info?: string;
};

const BadgeIndicators = ({ indicators, info }: Props) => {
  return (
    <div className="flex items-center space-x-4">
      {indicators.map((indicator) => (
        <TooltipProvider key={`${indicator.title}-${indicator.value}`}>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary">
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
            <span className="text-sm text-muted-foreground">{info}</span>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default BadgeIndicators;
