import { Badge } from "@/components/ui/badge";
import { COMPETENCY_LEVELS } from "@/constants/competency-level";
import React from "react";

interface SkillLevelBadgeProps {
  level: number;
  children: React.ReactNode;
}

export function SkillLevelBadge({
  level,
  children,
}: Readonly<SkillLevelBadgeProps>) {
  const {
    bgColor,
    icon: Icon,
    name,
    textColor,
  } = COMPETENCY_LEVELS[level] || 0;

  return (
    <Badge
      className={`px-1 py-0.5 rounded-full text-sm font-medium flex items-center gap-2 ${bgColor} ${textColor}`}
      aria-label={`Skill level ${name}`}
      title={`Skill level ${name}`}
    >
      <span className="flex items-center justify-center rounded-full p-0">
        <Icon className="h-4 w-4 " aria-hidden="true" />
      </span>
      <span>{children}</span>
    </Badge>
  );
}
