"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo } from "react";

interface SkillsTableClientProps {
  stats: any[];
  competencyLevels: any[];
  selectedSkill?: string | null;
  selectedLevel?: number | null;
}

export function SkillsTableClient({
  stats,
  selectedSkill,
  selectedLevel,
}: Readonly<SkillsTableClientProps>) {
  const total = useMemo(
    () => stats.reduce((sum, stat) => sum + (stat.count ?? 0), 0),
    [stats]
  );

  const filteredTableData = useMemo(() => {
    return stats
      .map((stat) => {
        const skillMatch = selectedSkill
          ? stat.skillName === selectedSkill
          : true;
        const levelMatch =
          selectedLevel !== null && selectedLevel !== undefined
            ? stat.level === selectedLevel
            : true;
        return {
          ...stat,
          percentage:
            total > 0 ? ((stat.count / total) * 100).toFixed(1) : "0.0",
          show: skillMatch && levelMatch,
        };
      })
      .filter((stat) => stat.show)
      .sort((a, b) => {
        return b.level - a.level;
      });
  }, [stats, selectedSkill, selectedLevel, total]);

  return (
    <Card className="shadow-md rounded-xl bg-white border-none ">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Detailed Skill Breakdown {total > 0 ? `(${total} total skills)` : ""}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="border-b bg-gray-50 border-gray-200">
                <TableHead>Skill</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>People</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTableData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-gray-500"
                  >
                    No data available for the selected filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTableData.map((stat, index) => {
                  return (
                    <TableRow
                      key={`${stat.skillName}-${stat.level}-${index}`}
                      className="hover:bg-blue-50 border-gray-200 transition-colors"
                    >
                      <TableCell className="font-medium whitespace-nowrap">
                        {stat.skillName}
                      </TableCell>
                      <TableCell>{stat.level}</TableCell>
                      <TableCell>{stat.count}</TableCell>
                      <TableCell>{stat.percentage}%</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
