"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { AiToolsTable } from "@/components/ai-statistics/ai-tools-table";
import type { EmployeeAiToolData } from "@/types/employees";
import { capitalizeFirstLetter, formatDepartment } from "@/lib/utils/normalize";
import {
  formatProficiencyLevel,
  formatFrequency,
} from "@/lib/utils/aiToolsUtils";

interface AiToolsSearchProps {
  aiTools: EmployeeAiToolData[];
}

export function AiToolsSearch({ aiTools }: AiToolsSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAiTools = useMemo(() => {
    if (!searchTerm) return aiTools;

    const lower = searchTerm.toLowerCase();

    return aiTools.filter((tool: EmployeeAiToolData) =>
      [
        tool.aiTools?.name,
        formatProficiencyLevel(tool.level),
        formatFrequency(tool.frequency),
        tool.employees?.firstName,
        tool.employees?.lastName,
        capitalizeFirstLetter(tool.employees.program),
        formatDepartment(tool.employees?.department),
        tool.employees?.role,
      ]
        .filter(Boolean)
        .some((field) => (field ? field.toLowerCase().includes(lower) : false))
    );
  }, [aiTools, searchTerm]);

  return (
    <>
      <Input
        type="text"
        placeholder="Search by AI tool, proficiency level, employee..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:max-w-md border-gray-300 focus:border-purple-500 focus:ring-purple-500 rounded-lg shadow-sm bg-white text-gray-800 focus:ring-2 focus:outline-none focus:ring-offset-2 focus:ring-offset-white mb-4"
      />
      <AiToolsTable aiTools={filteredAiTools} />
    </>
  );
}
