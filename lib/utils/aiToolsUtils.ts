import { AiToolFrequency, EmployeeAiTool } from "@/types/employees";

export function formatProficiencyLevel(level: number): string {
  const levels = ["Beginner", "Basic", "Intermediate", "Advanced", "Expert"];
  return levels[level] || "Beginner";
}

export function formatFrequency(frequency: AiToolFrequency): string {
  const frequencies: Record<AiToolFrequency, string> = {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    rarely: "Rarely",
  };
  return frequencies[frequency] || frequency;
}

export function sortAiToolsByName(aiTools: EmployeeAiTool[]): EmployeeAiTool[] {
  return [...aiTools].sort((a, b) => {
    const nameA = a.tool?.name || "";
    const nameB = b.tool?.name || "";
    return nameA.localeCompare(nameB);
  });
}

export function sortAiToolsByLevel(
  aiTools: EmployeeAiTool[]
): EmployeeAiTool[] {
  return [...aiTools].sort((a, b) => b.level - a.level);
}

export function filterAiToolsByLevel(
  aiTools: EmployeeAiTool[],
  minLevel: number
): EmployeeAiTool[] {
  return aiTools.filter((tool) => tool.level >= minLevel);
}

export function filterAiToolsByFrequency(
  aiTools: EmployeeAiTool[],
  frequency: AiToolFrequency
): EmployeeAiTool[] {
  return aiTools.filter((tool) => tool.frequency === frequency);
}

export const getLevelOrder = (level: string) => {
  const order: Record<string, number> = {
    Expert: 5,
    Advanced: 4,
    Intermediate: 3,
    Basic: 2,
    Beginner: 1,
  };
  return order[level] || 0;
};

export const getLevelNumber = (level: string) => {
  const levelMap: Record<string, number> = {
    Beginner: 0,
    Basic: 1,
    Intermediate: 2,
    Advanced: 3,
    Expert: 4,
  };
  return levelMap[level] || 0;
};

export const getLevelBadge = (level: number) => {
  const levels = [
    { label: "Beginner", color: "bg-gray-100 text-gray-700" },
    { label: "Basic", color: "bg-blue-100 text-blue-700" },
    { label: "Intermediate", color: "bg-green-100 text-green-700" },
    { label: "Advanced", color: "bg-orange-100 text-orange-700" },
    { label: "Expert", color: "bg-purple-100 text-purple-700" },
  ];

  return levels[level] || levels[0];
};

export const getFrequencyBadge = (frequency: string) => {
  const frequencies = {
    daily: { label: "Daily", color: "bg-green-100 text-green-800" },
    weekly: { label: "Weekly", color: "bg-blue-100 text-blue-800" },
    monthly: { label: "Monthly", color: "bg-yellow-100 text-yellow-800" },
    rarely: { label: "Rarely", color: "bg-gray-100 text-gray-800" },
  };

  return (
    frequencies[frequency as keyof typeof frequencies] || frequencies.rarely
  );
};
