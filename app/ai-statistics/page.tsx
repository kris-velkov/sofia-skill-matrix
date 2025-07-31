import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { AiToolsSearch } from "@/components/ai-statistics/ai-tools-search";
import { AiToolsStatsGrid } from "@/components/ai-statistics/ai-tools-stats-grid";
import { AiToolsUsageBreakdown } from "@/components/ai-statistics/ai-tools-usage-breakdown";
import { PageHeader } from "@/components/ai-statistics/page-header";
import { getAllEmployeesAiTools } from "../actions/ai-tools-statistics-action";
import { processAiToolsStatistics } from "@/lib/utils/aiStatisticsUtils";
import { Bot } from "lucide-react";

export const revalidate = 0;

export default async function AiToolsStatisticsPage() {
  const employeesAiTools = await getAllEmployeesAiTools();

  const breadcrumbItems = [
    { label: "AI Tools Statistics", href: "/ai-statistics" },
  ];

  const { uniqueTools, uniqueEmployees, mostUsedAiTool, aiToolsUsage } =
    processAiToolsStatistics(employeesAiTools);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          <div className="px-1">
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          <PageHeader
            title="AI Tools Analytics"
            description="Comprehensive insights into AI tool adoption, proficiency levels, and usage patterns across organization"
            icon={<Bot className="h-6 w-6 sm:h-8 sm:w-8" />}
          />

          <AiToolsStatsGrid
            uniqueTools={uniqueTools}
            uniqueEmployees={uniqueEmployees}
            mostUsedAiTool={mostUsedAiTool}
          />

          <AiToolsUsageBreakdown aiToolsUsage={aiToolsUsage} />

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Detailed AI Tools Data
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Search and filter through all AI tool assignments to find
                specific information about tools, employees, and proficiency
                levels
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <AiToolsSearch aiTools={employeesAiTools} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
