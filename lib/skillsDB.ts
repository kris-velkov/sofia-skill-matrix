import { db, ensureDbLoaded, getEmployeeIndexById } from "./db";
import type { Employee, SkillLevel } from "./types";

export async function deleteEmployeeSkillInDb(
  employeeId: string,
  category: { name: string; skills: { name: string; level: number }[] }
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const idx = getEmployeeIndexById(employeeId);
  if (idx === -1) return undefined;
  const employee = db.data.employees[idx];
  if (!Array.isArray(employee.skills)) return employee;
  employee.skills = employee.skills.filter((cat) => cat.name !== category.name);
  await db.write();
  return employee;
}

export async function updateEmployeeSkillsInDb(
  employeeId: string,
  category: { name: string; skills: { name: string; level: number }[] }
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const idx = getEmployeeIndexById(employeeId);
  if (idx === -1) return undefined;
  const employee = db.data.employees[idx];
  if (!Array.isArray(employee.skills)) employee.skills = [];
  const catIdx = employee.skills.findIndex((c) => c.name === category.name);
  const skillsWithLevel = category.skills.map((s) => ({
    ...s,
    level: s.level as SkillLevel,
  }));
  if (catIdx === -1) {
    employee.skills.push({
      name: category.name,
      skills: skillsWithLevel,
      averageLevel: skillsWithLevel.length
        ? Math.round(
            (skillsWithLevel.reduce((acc, s) => acc + s.level, 0) /
              skillsWithLevel.length) *
              10
          ) / 10
        : 0,
    });
  } else {
    employee.skills[catIdx] = {
      name: category.name,
      skills: skillsWithLevel,
      averageLevel: skillsWithLevel.length
        ? Math.round(
            (skillsWithLevel.reduce((acc, s) => acc + s.level, 0) /
              skillsWithLevel.length) *
              10
          ) / 10
        : 0,
    };
  }
  await db.write();
  return employee;
}

export async function updateEmployeeCategoryNameInDb(
  employeeId: string,
  oldName: string,
  newName: string
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const idx = getEmployeeIndexById(employeeId);
  if (idx === -1) return undefined;
  const employee = db.data.employees[idx];
  if (!Array.isArray(employee.skills)) return employee;
  const catIdx = employee.skills.findIndex((cat) => cat.name === oldName);
  if (catIdx !== -1) {
    employee.skills[catIdx].name = newName;
    await db.write();
  }
  return employee;
}
