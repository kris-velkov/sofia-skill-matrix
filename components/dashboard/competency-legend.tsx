"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { COMPETENCY_LEVELS } from "@/constants/competency-level";

export function CompetencyLegendContent() {
  return (
    <div className="p-4">
      {" "}
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Competency Levels
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Understanding skill proficiency ratings
      </p>
      <div className="grid gap-4">
        <div className="grid grid-cols-[auto_1fr_2fr_auto] items-center gap-x-4 text-sm font-medium text-muted-foreground">
          <div>GRADE</div>
          <div>NAME</div>
          <div>DESCRIPTION</div>
          <div>COLOR</div>
        </div>
        {COMPETENCY_LEVELS.map((level) => (
          <div
            key={level.grade}
            className="grid grid-cols-[auto_1fr_2fr_auto] items-center gap-x-4 text-sm"
          >
            <div className={cn("font-semibold", `text-skill-${level.grade}`)}>
              {level.grade}
            </div>
            <div className={cn("font-medium", `text-skill-${level.grade}`)}>
              {level.name}
            </div>
            <div className="text-muted-foreground">{level.description}</div>
            <div
              className={cn(
                "w-6 h-6 rounded-full border border-gray-200",
                level.bgColor
              )}
              aria-label={`Color for ${level.name}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompetencyLegendTrigger() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 hover:bg-gray-100"
          aria-label="Show Competency Legend"
        >
          <Info className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0 bg-white border-gray-200 rounded-lg shadow-lg">
        <CompetencyLegendContent />
      </PopoverContent>
    </Popover>
  );
}
