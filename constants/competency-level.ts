import { SkillLevel } from "@/types/employees";
import {
  Award,
  CheckCircle,
  Circle,
  LucideIcon,
  Star,
  TrendingUp,
} from "lucide-react";

export interface CompetencyLevel {
  grade: SkillLevel;
  icon: LucideIcon;
  name: string;
  description: string;
  textColor: string;
  bgColor: string;
  progressTextColor: string;
}

export const COMPETENCY_LEVELS: CompetencyLevel[] = [
  {
    grade: 0,
    icon: Circle,
    name: "No competency",
    description: "I know nothing about this or the skill is not applicable.",
    textColor: "text-white",
    bgColor: "bg-rose-400",
    progressTextColor: "text-gray-400",
  },
  {
    grade: 1,
    icon: Star,
    name: "Some knowledge",
    description:
      "I know something, and after further reading I am able to perform simple tasks.",
    bgColor: "bg-red-300",
    textColor: "text-white",
    progressTextColor: "text-red-400",
  },
  {
    grade: 2,
    name: "Working knowledge",
    icon: TrendingUp,
    description:
      "I can perform simple tasks. After further reading I can challenge average tasks.",
    bgColor: "bg-yellow-400",
    textColor: "text-white",
    progressTextColor: "text-yellow-400",
  },
  {
    grade: 3,
    icon: CheckCircle,
    name: "Good competency",
    description:
      "I can perform average tasks and with further research I can challenge complex tasks.",
    bgColor: "bg-green-400",
    textColor: "text-white",
    progressTextColor: "text-green-600",
  },
  {
    grade: 4,
    icon: Award,
    name: "Expert",
    description:
      "I can perform complex tasks and with further research I can challenge very complex tasks.",
    bgColor: "bg-sky-500",
    textColor: "text-white",
    progressTextColor: "text-sky-500",
  },
];
