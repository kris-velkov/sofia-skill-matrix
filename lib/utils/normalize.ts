import { Department, DepartmentLabels } from "@/types/employees";

export function normalizeName(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ");
}

export function capitalizeFirstLetter(str: string | null): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function normalizeDepartment(department: string): Department {
  const normalized = department
    .toLowerCase()
    .trim()
    .replace(/\-/g, "")
    .replace(/\s+/g, "");

  // Map normalized department names to Department keys
  const departmentMap: Record<string, Department> = {
    fe: "fe",
    frontend: "fe",
    "front-end": "fe",
    be: "be",
    backend: "be",
    "back-end": "be",
    qa: "qa",
    "quality assurance": "qa",
    pm: "pm",
    projectmanager: "pm",
    "project manager": "pm",
    co: "co",
    cloudops: "co",
  };

  const mappedDepartment = departmentMap[normalized];
  if (mappedDepartment) return mappedDepartment;

  throw new Error(`Invalid department: ${department}, ${normalized}`);
}

export function formatDepartment(
  department: Department | string | null
): string {
  if (!department) return "";
  return DepartmentLabels[department as Department] || department;
}
