import { EmployeeAiToolData } from "@/types/employees";

export interface ProcessedAiToolsData {
  totalTools: number;
  uniqueTools: number;
  uniqueEmployees: number;
  mostUsedAiTool: string;
  averageToolsPerEmployee: string;
  aiToolsUsage: Record<string, AiToolUsageData>;
}

export interface AiToolUsageData {
  total: number;
  levels: Record<string, number>;
  users: Array<{
    name: string;
    level: string;
    id?: string;
    profileImage?: string | null;
    department?: string | null;
    role?: string | null;
  }>;
}

export function processAiToolsStatistics(
  employeesAiTools: EmployeeAiToolData[]
): ProcessedAiToolsData {
  const totalTools = employeesAiTools.length;
  const uniqueTools = new Set(employeesAiTools.map((tool) => tool.aiTools.name))
    .size;
  const uniqueEmployees = new Set(
    employeesAiTools.map((tool) => tool.employees?.id)
  ).size;
  const averageToolsPerEmployee =
    uniqueEmployees > 0 ? (totalTools / uniqueEmployees).toFixed(1) : "0";
  const toolUsageCount = employeesAiTools.reduce((acc, tool) => {
    const toolName = tool.aiTools.name;
    acc[toolName] = (acc[toolName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostUsedAiTool =
    Object.entries(toolUsageCount).reduce(
      (max, [toolName, count]) =>
        count > max.count ? { name: toolName, count } : max,
      { name: "", count: 0 }
    ).name || "None";

  const aiToolsUsage = employeesAiTools.reduce((acc, tool) => {
    const toolName = tool.aiTools.name;
    const levels = ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"];
    const levelName = levels[tool.level] || "Beginner";
    const employeeName =
      `${tool.employees?.firstName || ""} ${
        tool.employees?.lastName || ""
      }`.trim() || "Unknown";

    if (!acc[toolName]) {
      acc[toolName] = {
        total: 0,
        levels: {
          Beginner: 0,
          Basic: 0,
          Intermediate: 0,
          Advanced: 0,
          Expert: 0,
        },
        users: [],
      };
    }

    acc[toolName].total += 1;
    acc[toolName].levels[levelName] += 1;
    acc[toolName].users.push({
      name: employeeName,
      level: levelName,
      id: tool.employees?.id,
      profileImage: tool.employees?.profileImage,
      department: tool.employees?.department,
      role: tool.employees?.role,
    });
    return acc;
  }, {} as Record<string, AiToolUsageData>);

  return {
    totalTools,
    uniqueTools,
    uniqueEmployees,
    mostUsedAiTool,
    averageToolsPerEmployee,
    aiToolsUsage,
  };
}

export function sortToolsByUsage(
  aiToolsUsage: Record<string, AiToolUsageData>
) {
  return Object.entries(aiToolsUsage).sort(([, a], [, b]) => b.total - a.total);
}

export function getToolStatistics(data: AiToolUsageData) {
  const totalUsers = data.total;
  const levelDistribution = Object.entries(data.levels)
    .filter(([, count]) => count > 0)
    .sort(([a], [b]) => {
      const order = {
        Expert: 5,
        Advanced: 4,
        Intermediate: 3,
        Basic: 2,
        Beginner: 1,
      };
      return (
        (order[b as keyof typeof order] || 0) -
        (order[a as keyof typeof order] || 0)
      );
    });

  const topLevel = levelDistribution[0]?.[0] || "Beginner";
  const averageLevel =
    Object.entries(data.levels).reduce((sum, [level, count]) => {
      const levelValue =
        { Beginner: 1, Basic: 2, Intermediate: 3, Advanced: 4, Expert: 5 }[
          level
        ] || 1;
      return sum + levelValue * count;
    }, 0) / totalUsers;

  return {
    totalUsers,
    topLevel,
    averageLevel: Math.round(averageLevel * 100) / 100,
    levelDistribution,
  };
}
