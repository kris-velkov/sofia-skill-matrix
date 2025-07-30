"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import {
  AiToolUsageData,
  sortToolsByUsage,
} from "@/lib/utils/aiStatisticsUtils";
import { AiToolCard } from "./ai-tool-card";

interface AiToolsUsageBreakdownProps {
  aiToolsUsage: Record<string, AiToolUsageData>;
}

export function AiToolsUsageBreakdown({
  aiToolsUsage,
}: AiToolsUsageBreakdownProps) {
  const [openTools, setOpenTools] = useState<Set<string>>(new Set());
  const sortedTools = sortToolsByUsage(aiToolsUsage);

  const toggleTool = (toolName: string) => {
    const newOpenTools = new Set(openTools);
    if (newOpenTools.has(toolName)) {
      newOpenTools.delete(toolName);
    } else {
      newOpenTools.add(toolName);
    }
    setOpenTools(newOpenTools);
  };

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4 sm:pb-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3 mb-2">
              <div className="p-1.5 sm:p-2 bg-gray-700 rounded-lg flex-shrink-0">
                <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="truncate">AI Tools Usage Analytics</span>
            </CardTitle>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Detailed breakdown of AI tool adoption and proficiency levels
              across your team
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6">
          {sortedTools.map(([toolName, data]) => (
            <AiToolCard
              key={toolName}
              toolName={toolName}
              data={data}
              isOpen={openTools.has(toolName)}
              onToggle={() => toggleTool(toolName)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
