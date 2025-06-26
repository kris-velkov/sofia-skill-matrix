import React from "react";
import type { Skill } from "@/lib/types";
import { SkillLevelBadge } from "./employee-skill-level-badge";

interface EmployeeTopSkillsProps {
  skills: Skill[];
}
export function EmployeeTopSkills({ skills }: EmployeeTopSkillsProps) {
  if (skills.length === 0) return null;
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
        Top Skills
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillLevelBadge key={skill.name} level={skill.level}>
            <span>{skill.name}</span>
            <span className="inline-block rounded px-1 ml-1 text-[10px] font-bold">
              {skill.level}
            </span>
          </SkillLevelBadge>
        ))}
      </div>
    </div>
  );
}
