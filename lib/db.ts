// IMPORTANT: This file must only be used in server-side code (server actions, API routes, or server components)
// Do NOT import this file in any client component or client-side code!

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import type { Employee, SkillLevel } from "./types";
import path from "path";

type Data = {
  employees: Employee[];
};

const adapter = new JSONFile<Data>(
  path.join(process.cwd(), "data", "employees.json")
);

const db = new Low<Data>(adapter, { employees: [] });

async function ensureDbLoaded() {
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

export async function getEmployeeById(
  id: string
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  return db.data.employees.find((emp) => emp.id === id);
}

export async function addEmployee(newEmployee: Employee): Promise<Employee> {
  await ensureDbLoaded();
  db.data.employees.push(newEmployee);
  await db.write();
  return newEmployee;
}

export async function updateEmployee(
  updatedEmployee: Employee
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const index = db.data.employees.findIndex(
    (emp) => emp.id === updatedEmployee.id
  );
  if (index > -1) {
    db.data.employees[index] = updatedEmployee;
    await db.write();
    return updatedEmployee;
  }
  return undefined;
}

export async function updateEmployeeCertificates(
  id: string,
  certificates: Employee["certificates"]
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const index = db.data.employees.findIndex((emp) => emp.id === id);
  if (index > -1) {
    db.data.employees[index].certificates = certificates;
    await db.write();
    return db.data.employees[index];
  }
  return undefined;
}

export async function deleteCertificate(
  id: string,
  certificateId: string
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const index = db.data.employees.findIndex((emp) => emp.id === id);
  if (index > -1) {
    db.data.employees[index].certificates = db.data.employees[
      index
    ].certificates.filter((cert) => cert.id !== certificateId);
    await db.write();
    return db.data.employees[index];
  }
  return undefined;
}

export async function addCertificate(
  id: string,
  certificate: Employee["certificates"][number]
): Promise<Employee | undefined> {
  await ensureDbLoaded();
  const index = db.data.employees.findIndex((emp) => emp.id === id);
  if (index > -1) {
    db.data.employees[index].certificates.push(certificate);
    await db.write();
    return db.data.employees[index];
  }
  return undefined;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  await ensureDbLoaded();
  const initialLength = db.data.employees.length;
  db.data.employees = db.data.employees.filter((emp) => emp.id !== id);
  const deleted = db.data.employees.length < initialLength;
  if (deleted) await db.write();
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
