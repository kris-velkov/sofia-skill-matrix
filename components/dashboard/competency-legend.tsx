"use client"

import { Info } from "lucide-react" // Added Info icon
import { Button } from "@/components/ui/button"
import { COMPETENCY_LEVELS } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover" // Import Popover components

// This component will now only render the legend content
export function CompetencyLegendContent() {
  return (
    <div className="p-4">
      {" "}
      {/* Added padding for content */}
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Competency Levels</h3>
      <p className="text-sm text-muted-foreground mb-4">Understanding skill proficiency ratings</p>
      <div className="grid gap-4">
        <div className="grid grid-cols-[auto_1fr_2fr_auto] items-center gap-x-4 text-sm font-medium text-muted-foreground">
          <div>GRADE</div>
          <div>NAME</div>
          <div>DESCRIPTION</div>
          <div>COLOR</div>
        </div>
        {COMPETENCY_LEVELS.map((level) => (
          <div key={level.grade} className="grid grid-cols-[auto_1fr_2fr_auto] items-center gap-x-4 text-sm">
            <div className={cn("font-semibold", `text-skill-${level.grade}`)}>{level.grade}</div>
            <div className={cn("font-medium", `text-skill-${level.grade}`)}>{level.name}</div>
            <div className="text-muted-foreground">{level.description}</div>
            <div
              className={cn("w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700", level.color)}
              aria-label={`Color for ${level.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// This component will be the trigger for the legend popover
export function CompetencyLegendTrigger() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Show Competency Legend"
        >
          <Info className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <CompetencyLegendContent />
      </PopoverContent>
    </Popover>
  )
}
