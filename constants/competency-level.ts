import { SkillLevel } from "@/lib/types";

export interface CompetencyLevel {
  grade: SkillLevel;
  name: string;
  description: string;
  color: string;
}

export const COMPETENCY_LEVELS: CompetencyLevel[] = [
  {
    grade: 0,
    name: "No competency",
    description: "I know nothing about this or the skill is not applicable.",
    color: "bg-red-500",
  },
  {
    grade: 1,
    name: "Some knowledge",
    description:
      "I know something, and after further reading I am able to perform simple tasks.",
    color: "bg-orange-500",
  },
  {
    grade: 2,
    name: "Working knowledge",
    description:
      "I can perform simple tasks. After further reading I can challenge average tasks.",
    color: "bg-yellow-200",
  },
  {
    grade: 3,
    name: "Good competency",
    description:
      "I can perform average tasks and with further research I can challenge complex tasks.",
    color: "bg-green-500",
  },
  {
    grade: 4,
    name: "Expert",
    description:
      "I can perform complex tasks and with further research I can challenge very complex tasks.",
    color: "bg-blue-500",
  },
];

export const LEVEL_COLORS = [
  {
    bar: "bg-gray-300",
    text: "text-gray-500",
    label: "No Competency",
  },
  {
    bar: "bg-orange-400",
    text: "text-orange-600",
    label: "Some knowledge",
  },
  {
    bar: "bg-yellow-400",
    text: "text-yellow-700",
    label: "Working knowledge",
  },
  {
    bar: "bg-green-400",
    text: "text-green-700",
    label: "Good proficiency",
  },
  {
    bar: "bg-blue-500",
    text: "text-blue-700",
    label: "Expert",
  },
];

export const CAREER_EXPERIENCE_LEVELS = [
  "0-1y",
  "1-3y",
  "3-5y",
  "5-10y",
  "10y+",
] as const;

export const SKILL_LEVELS = [1, 2, 3, 4];
