import { PostgrestError } from "@supabase/supabase-js";
import { Department, SkillLevel } from "./employees";
import { Database } from "./supabase";

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type SkillRow = Database["public"]["Tables"]["skills"]["Row"];
export type EmployeeSkillLevelRow =
  Database["public"]["Tables"]["employees_skill_levels"]["Row"];

export interface SkillData {
  id?: string;
  name: string;
  level: number;
}

export interface CategoryData {
  id?: string;
  name: string;
  skills: SkillData[];
  departments?: string[];
  default?: boolean;
}

export interface GroupedSkill {
  name: string;
  level: number;
}

export interface GroupedCategory {
  name: string;
  skills: GroupedSkill[];
  averageLevel: number;
}

export interface RawSkillData {
  level: number;
  skills: {
    name: string;
    categories: {
      name: string;
    };
  };
}

export interface SkillOperationResult {
  success: boolean;
  error: PostgrestError | null;
}

export interface CategoryOperationResult {
  success: boolean;
  isOriginal?: boolean;
  error?: PostgrestError;
}

export interface CategoryResult {
  id: string;
  name: string;
  departments: string[];
}
