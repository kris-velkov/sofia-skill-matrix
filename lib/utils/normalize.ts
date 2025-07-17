import { ROLES } from "@/constants/employeeDefaultsSkills";
import { Department } from "@/types/employees";

export function normalizeSkillName(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ");
}

export function normalizeDepartment(department: string): Department {
  const normalized = department
    .toLowerCase()
    .trim()
    .replace(/\-/g, "")
    .replace(/\s+/g, "");

  const role = ROLES.find(
    (role) =>
      role.departament === normalized ||
      (role.departament === "fe" && normalized === "frontend") ||
      (role.departament === "be" && normalized === "backend") ||
      (role.departament === "qa" && normalized === "quality assurance") ||
      (role.departament === "pm" && normalized === "projectmanager")
  );

  if (role) return role.departament;
  throw new Error(`Invalid department: ${department}, ${normalized}`);
}

export function formatDepartment(department: Department | string): string {
  const role = ROLES.find((role) => role.departament === department);
  return role ? role.name : department;
}
