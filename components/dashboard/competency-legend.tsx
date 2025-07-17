"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { COMPETENCY_LEVELS } from "@/constants/competency-level";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function CompetencyLegendContent() {
  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Competency Levels</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Understanding skill proficiency ratings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b border-gray-200">
              <TableHead className="w-[60px] font-semibold text-gray-700">
                GRADE
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                NAME
              </TableHead>
              <TableHead className="w-[40%] font-semibold text-gray-700">
                DESCRIPTION
              </TableHead>
              <TableHead className="w-[60px] font-semibold text-gray-700">
                COLOR
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMPETENCY_LEVELS.map((level) => (
              <TableRow
                key={level.grade}
                className="hover:bg-gray-50 transition-colors border-b border-gray-200"
              >
                <TableCell
                  className={cn(
                    "font-bold text-center",
                    `text-skill-${level.grade}`
                  )}
                >
                  {level.grade}
                </TableCell>
                <TableCell
                  className={cn("font-medium", `text-skill-${level.grade}`)}
                >
                  {level.name}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {level.description}
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border border-gray-200 shadow-sm mx-auto",
                      level.bgColor
                    )}
                    aria-label={`Color for ${level.name}`}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function CompetencyLegendTrigger() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Show Competency Legend"
        >
          <Info className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[550px] p-0 rounded-lg shadow-lg border border-gray-200 bg-white">
        <CompetencyLegendContent />
      </PopoverContent>
    </Popover>
  );
}
