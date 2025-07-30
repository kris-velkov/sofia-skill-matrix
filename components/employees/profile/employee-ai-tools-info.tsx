import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Bot, Cpu, Zap } from "lucide-react";
import type { EmployeeAiTool } from "@/types/employees";
import EmptyState from "@/components/ui/empty-state";
import { getFrequencyBadge, getLevelBadge } from "@/lib/utils/aiToolsUtils";

interface EmployeeAiToolsInfoProps {
  aiTools: EmployeeAiTool[] | null;
}

export const EmployeeAiToolsInfo: React.FC<EmployeeAiToolsInfoProps> = ({
  aiTools,
}) => (
  <Card className="p-3 shadow-lg border border-orange-200 rounded-lg">
    <CardHeader className="p-0 mb-3 flex flex-row items-center justify-between">
      <CardTitle className="text-lg font-bold text-orange-900 flex items-center gap-2">
        <Bot className="h-4 w-4 text-orange-500" />
        AI Tools
      </CardTitle>
    </CardHeader>
    {aiTools && aiTools.length > 0 ? (
      <div className="space-y-2">
        {aiTools.map((aiTool, idx) => {
          const levelBadge = getLevelBadge(aiTool.level);
          const frequencyBadge = getFrequencyBadge(aiTool.frequency);

          return (
            <div key={aiTool.toolId + idx}>
              <div className="flex flex-col bg-white/80 border border-purple-50 rounded-lg p-6 shadow-sm">
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-sm block break-words">
                    {aiTool.tool?.name}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${levelBadge.color}`}
                    >
                      <Cpu className="w-2.5 h-2.5 mr-1" />
                      {levelBadge.label}
                    </span>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${frequencyBadge.color}`}
                    >
                      <Zap className="w-2.5 h-2.5 mr-1" />
                      {frequencyBadge.label}
                    </span>
                  </div>
                </div>
              </div>
              {idx !== aiTools.length - 1 && (
                <Separator className="my-1 bg-gradient-to-r from-purple-200 via-blue-100 to-transparent" />
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <EmptyState
        className="text-gray-600"
        icon={<Bot className="w-5 h-5 mb-1" />}
        message="No AI tools listed for this employee."
      />
    )}
  </Card>
);

export default EmployeeAiToolsInfo;
