import { Bot, Users, TrendingUp } from "lucide-react";
import { StatisticsCard } from "../certificates-statistics/statistics-card";

interface AiToolsStatsGridProps {
  uniqueTools: number;
  uniqueEmployees: number;
  mostUsedAiTool: string;
}

export function AiToolsStatsGrid({
  uniqueTools,
  uniqueEmployees,
  mostUsedAiTool,
}: AiToolsStatsGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <StatisticsCard
        title="People Using AI"
        value={uniqueEmployees}
        icon={<Users className="h-6 w-6 sm:h-8 sm:w-8" />}
        iconColor="text-blue-500"
      />

      <StatisticsCard
        title="Most Used Tool"
        value={mostUsedAiTool}
        icon={<TrendingUp className="h-6 w-6 sm:h-8 sm:w-8" />}
        iconColor="text-orange-500"
      />

      <StatisticsCard
        title="Unique AI Tools"
        value={uniqueTools}
        icon={<Bot className="h-6 w-6 sm:h-8 sm:w-8" />}
        iconColor="text-blue-500"
      />
    </section>
  );
}
