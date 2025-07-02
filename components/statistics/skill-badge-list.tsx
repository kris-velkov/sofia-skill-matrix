import { Badge } from "@/components/ui/badge";
import React from "react";

interface SkillBadgeListProps {
  skills: { skillName: string; level: number }[];
  level: number;
  className?: string;
}

export const SkillBadgeList: React.FC<SkillBadgeListProps> = ({
  skills,
  level,
  className = "",
}) => {
  if (!skills.length) return null;
  return (
    <div
      className={`w-full max-w-md bg-blue-50 rounded-lg border border-blue-200 p-4 shadow-sm mb-4 ${className}`}
    >
      <div className="font-semibold mb-2 text-blue-900">
        Skills for Level {level}:
      </div>
      <ul className="flex flex-wrap gap-2">
        {skills.map((d) => (
          <li key={d.skillName}>
            <Badge className="bg-blue-600 text-white">{d.skillName}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
};
