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

