"use client";

import { cn } from "@/lib/utils/cn";

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
        <CardTitle className="text-lg sm:text-xl font-bold">
          Competency Levels
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm text-gray-500">
          Understanding skill proficiency ratings
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="w-[40px] sm:w-[60px] font-semibold text-gray-700 text-xs sm:text-sm">
                  GRADE
                </TableHead>
                <TableHead className="font-semibold text-gray-700 text-xs sm:text-sm">
                  NAME
                </TableHead>
                <TableHead className="w-[30%] sm:w-[40%] font-semibold text-gray-700 text-xs sm:text-sm">
                  DESCRIPTION
                </TableHead>
                <TableHead className="w-[40px] sm:w-[60px] font-semibold text-gray-700 text-xs sm:text-sm">
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
                      "font-bold text-center text-xs sm:text-sm",
                      `text-skill-${level.grade}`
                    )}
                  >
                    {level.grade}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "font-medium text-xs sm:text-sm",
                      `text-skill-${level.grade}`
                    )}
                  >
                    {level.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs sm:text-sm">
                    {level.description}
                  </TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-gray-200 shadow-sm mx-auto",
                        level.bgColor
                      )}
                      aria-label={`Color for ${level.name}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
