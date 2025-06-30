import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import type { Employee } from "./types";
import path from "path";

type Data = {
  employees: Employee[];
};

const adapter = new JSONFile<Data>(
  path.join(process.cwd(), "data", "employees.json")
);

export const db = new Low<Data>(adapter, { employees: [] });

export async function ensureDbLoaded() {
  await db.read();
  if (!db.data) {
    db.data = { employees: [] };
    await db.write();
  }
}

export async function getEmployees(): Promise<Employee[]> {
  await ensureDbLoaded();
  return db.data.employees;
}

export function getEmployeeIndexById(id: string): number {
  return db.data.employees.findIndex((emp) => emp.id === id);
}

export async function getEmployeeById(
  id: string
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  return db.data.employees.find((emp) => emp.id === id);
}

export async function updateEmployee(
  updatedEmployee: Employee
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const index = getEmployeeIndexById(updatedEmployee.id);
  if (index > -1) {
    db.data.employees[index] = updatedEmployee;
    await db.write();
    return updatedEmployee;
  }
  return undefined;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  await ensureDbLoaded();
  const index = getEmployeeIndexById(id);
  if (index > -1) {
    db.data.employees.splice(index, 1);
    await db.write();
    return true;
  }
  return false;
}

// --- DB Utility Improvements ---

export async function updateEmployeeFieldById<T extends keyof Employee>(
  id: string,
  field: T,
  value: Employee[T]
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const idx = getEmployeeIndexById(id);
  if (idx > -1) {
    db.data.employees[idx][field] = value;
    await db.write();
    return db.data.employees[idx];
  }
  return undefined;
}

export async function updateEmployeePartial(
  id: string,
  data: Partial<Employee>
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const idx = getEmployeeIndexById(id);
  if (idx > -1) {
    db.data.employees[idx] = { ...db.data.employees[idx], ...data };
    await db.write();
    return db.data.employees[idx];
  }
  return undefined;
}

export async function updateEmployeePersonalInfoInDb(
  employeeId: string,
  data: Partial<Employee>
) {
  return updateEmployeePartial(employeeId, data);
}
