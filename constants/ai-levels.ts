import { AiToolFrequency } from "@/types/employees";

export const PROFICIENCY_LEVELS = [
  { value: 0, label: "Beginner" },
  { value: 1, label: "Basic" },
  { value: 2, label: "Intermediate" },
  { value: 3, label: "Advanced" },
  { value: 4, label: "Expert" },
];

export const FREQUENCY_OPTIONS: { value: AiToolFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "rarely", label: "Rarely" },
];
