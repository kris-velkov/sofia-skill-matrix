import { Badge } from "@/components/ui/badge";
import { Circle, Star, TrendingUp, CheckCircle, Award } from "lucide-react";
import React from "react";

interface SkillLevelBadgeProps {
  level: number;
  children: React.ReactNode;
}

const LEVELS = [
  {
    style: "bg-red-400 ",
    icon: Circle,
    label: "0",
  },
  {
    style: "bg-orange-400",
    icon: Star,
    label: "1",
  },
  {
    style: "bg-yellow-400",
    icon: TrendingUp,
    label: "2",
  },
  {
    style: "bg-green-400",
    icon: CheckCircle,
    label: "3",
  },
  {
    style: "bg-blue-400",
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
      className={`px-1 py-0.5 rounded-full text-sm font-medium flex items-center gap-2 text-white shadow-md ${style} transition-all duration-200`}
      aria-label={`Skill level ${label}`}
      title={`Skill level ${label}`}
    >
      <span className="flex items-center justify-center bg-white/20 rounded-full p-1">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span>{children}</span>
    </Badge>
  );
}
