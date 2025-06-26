import type { SkillLevel } from "@/lib/types";

export const SKILL_LEVELS: SkillLevel[] = [0, 1, 2, 3, 4];
export function getSkillLevels(): SkillLevel[] {
  return SKILL_LEVELS;
}
