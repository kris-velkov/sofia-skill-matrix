import { Badge } from "@/components/ui/badge";
import { Circle, Star, TrendingUp, CheckCircle, Award } from "lucide-react";
import React from "react";

interface SkillLevelBadgeProps {
  level: number; // 0 (none) to 4 (best)
  children: React.ReactNode;
}

const levelStyles = [
  // 0: lack of knowledge
  "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  // 1: beginner
  "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
  // 2: intermediate
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  // 3: advanced
  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  // 4: expert (best)
  "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100",
];

const levelIcons = [
  <Circle key={0} className="h-3 w-3" />, // 0: lack of knowledge
  <Star key={1} className="h-3 w-3" />, // 1: beginner
  <TrendingUp key={2} className="h-3 w-3" />, // 2: intermediate
  <CheckCircle key={3} className="h-3 w-3" />, // 3: advanced
  <Award key={4} className="h-3 w-3" />, // 4: expert
];

export function SkillLevelBadge({ level, children }: SkillLevelBadgeProps) {
  // Clamp level between 0 and 4
  const safeLevel = Math.max(0, Math.min(4, level));
  const badgeClass =
    "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm " +
    levelStyles[safeLevel];

  return (
    <Badge className={badgeClass}>
      {levelIcons[safeLevel]}
      {children}
    </Badge>
  );
}
