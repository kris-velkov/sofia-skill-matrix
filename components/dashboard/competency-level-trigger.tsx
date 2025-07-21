import { Popover, PopoverContent } from "@radix-ui/react-popover";
import { PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils/cn";
import { Info, X } from "lucide-react";
import { Button } from "../ui/button";
import { CompetencyLegendContent } from "./competency-legend";
import { useState } from "react";

interface CompetencyLegendTriggerProps {
  className?: string;
  onClick?: () => void;
}

export function CompetencyLegendTrigger({
  className,
  onClick,
}: CompetencyLegendTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "text-gray-700 hover:bg-gray-100 rounded-full transition-colors",
            className
          )}
          aria-label="Show Competency Legend"
          onClick={onClick}
        >
          <Info className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[99vw] sm:w-[90vw] md:w-[80vw] lg:w-auto max-w-[550px] p-0 rounded-lg shadow-lg border border-gray-200 bg-white max-h-[80vh] overflow-auto relative"
        align="end"
        sideOffset={5}
      >
        {open && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-gray-500 hover:bg-gray-100 rounded-full"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <CompetencyLegendContent />
      </PopoverContent>
    </Popover>
  );
}

export default CompetencyLegendTrigger;
