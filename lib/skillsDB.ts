import { db, ensureDbLoaded, getEmployeeIndexById } from "./db";
import { Employee } from "./types";

export async function addEmployeeSkillInDb(
  employeeId: string,
  skill: { name: string; level: number }
): Promise<Employee | undefined> {
  await ensureDbLoaded();

  const idx = getEmployeeIndexById(employeeId);
  if (idx === -1) return undefined;

  const employee = db.data.employees[idx];
  if (!Array.isArray(employee.skills)) employee.skills = [];

  if (employee.skills.some((s) => s.name === skill.name)) return employee;

  employee.skills.push({
    name: skill.name,
    skills: [],
    averageLevel: skill.level,
  });
  await db.write();
  return employee;
}

export async function updateEmployeeSkillInDb(
  employeeId: string,
  skill: { name: string; level: number }
): Promise<Employee | undefined> {
  await ensureDbLoaded();

  const idx = getEmployeeIndexById(employeeId);
  if (idx === -1) return undefined;

  const employee = db.data.employees[idx];
  if (!Array.isArray(employee.skills)) return employee;

  const skillIdx = employee.skills.findIndex((s) => s.name === skill.name);
  if (skillIdx === -1) return employee;

  employee.skills[skillIdx] = {
    name: skill.name,
    skills: [],
    averageLevel: skill.level,
  };

  await db.write();
  return employee;
}

export async function deleteEmployeeSkillInDb(
  employeeId: string,
  skillName: string
): Promise<Employee | undefined> {
  await ensureDbLoaded();

  const idx = getEmployeeIndexById(employeeId);
  if (idx === -1) return undefined;

  const employee = db.data.employees[idx];
  if (!Array.isArray(employee.skills)) return employee;

  const newSkills = employee.skills.filter((skill) => skill.name !== skillName);
  if (newSkills.length === employee.skills.length) return employee;

  employee.skills = newSkills;
  await db.write();
  return employee;
}

