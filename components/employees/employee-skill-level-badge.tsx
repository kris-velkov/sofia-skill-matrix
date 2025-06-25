import { Badge } from "@/components/ui/badge";
import { Circle, Star, TrendingUp, CheckCircle, Award } from "lucide-react";
import React from "react";

interface SkillLevelBadgeProps {
  level: number;
  children: React.ReactNode;
}

const LEVELS = [
  {
    style: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
    icon: Circle,
    label: "0",
  },
  {
    style:
      "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
    icon: Star,
    label: "1",
  },
  {
    style:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: TrendingUp,
    label: "2",
  },
  {
    style: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    icon: CheckCircle,
    label: "3",
  },
  {
    style:
      "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100",
    icon: Award,
    label: "4",
  },
];

export function SkillLevelBadge({
  level,
  children,
}: Readonly<SkillLevelBadgeProps>) {
  const { style, icon: Icon, label } = LEVELS[level] || LEVELS[0];

  return (
    <Badge
      className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm ${style}`}
      aria-label={label}
      title={label}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {children}
    </Badge>
  );
}
