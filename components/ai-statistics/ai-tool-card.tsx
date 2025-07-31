"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Users, BarChart3, Bot } from "lucide-react";
import { AiToolUsageData } from "@/lib/utils/aiStatisticsUtils";
import { AiToolLevelDistribution } from "./ai-tool-level-distribution";
import { AiToolUsersList } from "./ai-tool-users-list";

interface AiToolCardProps {
  toolName: string;
  data: AiToolUsageData;
  isOpen: boolean;
  onToggle: () => void;
}

export function AiToolCard({
  toolName,
  data,
  isOpen,
  onToggle,
}: AiToolCardProps) {
  const [viewMode, setViewMode] = useState<"grid" | "table">("table");

  return (
    <Card className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <h4 className="font-bold text sm:text-xl text-gray-900 truncate">
                  {toolName}
                </h4>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold text-xs sm:text-sm flex-shrink-0">
                {data.total} {data.total === 1 ? "user" : "users"}
              </Badge>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Click to {isOpen ? "hide" : "view"} users
              </div>
              <div className="text-xs sm:text-sm text-gray-500 sm:hidden">
                {isOpen ? "Hide" : "View"} users
              </div>
              {isOpen ? (
                <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <div className="px-4 sm:px-6 pb-4 border-b border-gray-100">
          <AiToolLevelDistribution levels={data.levels} />
        </div>

        <CollapsibleContent>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h5 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                Team Members ({data.users.length})
              </h5>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`text-xs flex-1 sm:flex-none transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-gray-600 hover:bg-gray-700 text-white shadow-md"
                      : "hover:bg-gray-100 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="font-medium">Grid</span>
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={`text-xs flex-1 sm:flex-none transition-all duration-200 ${
                    viewMode === "table"
                      ? "bg-gray-600 hover:bg-gray-700 text-white shadow-md"
                      : "hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  <span className="font-medium">Table</span>
                </Button>
              </div>
            </div>

            <AiToolUsersList users={data.users} viewMode={viewMode} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
