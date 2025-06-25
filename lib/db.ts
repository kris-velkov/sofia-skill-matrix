// IMPORTANT: This file must only be used in server-side code (server actions, API routes, or server components)
// Do NOT import this file in any client component or client-side code!

import { promises as fs } from "fs";
import path from "path";
import type { Employee, SkillLevel } from "./types";

const EMPLOYEES_JSON_PATH = path.join(process.cwd(), "data", "employees.json");

type Data = { employees: Employee[] };

async function readData(): Promise<Data> {
  const data = await fs.readFile(EMPLOYEES_JSON_PATH, "utf-8");
  return JSON.parse(data);
}

async function writeData(data: Data) {
  await fs.writeFile(EMPLOYEES_JSON_PATH, JSON.stringify(data, null, 2));
}

export async function getEmployees(): Promise<Employee[]> {
  const data = await readData();
  return data.employees;
}

export async function getEmployeeById(
  id: string
): Promise<Employee | undefined> {
  const data = await readData();
  return data.employees.find((emp) => emp.id === id);
}

export async function addEmployee(newEmployee: Employee): Promise<Employee> {
  const data = await readData();
  data.employees.push(newEmployee);
  await writeData(data);
  return newEmployee;
}

export async function updateEmployee(
  updatedEmployee: Employee
): Promise<Employee | undefined> {
  const data = await readData();
  const index = data.employees.findIndex(
    (emp) => emp.id === updatedEmployee.id
  );
  if (index > -1) {
    data.employees[index] = updatedEmployee;
    await writeData(data);
    return updatedEmployee;
  }
  return undefined;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const data = await readData();
  const initialLength = data.employees.length;
  data.employees = data.employees.filter((emp) => emp.id !== id);
  const deleted = data.employees.length < initialLength;
  if (deleted) await writeData(data);
  return deleted;
}

export function getSkillLevels() {
  return [0, 1, 2, 3, 4] as SkillLevel[];
}

export const dbApi = {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
