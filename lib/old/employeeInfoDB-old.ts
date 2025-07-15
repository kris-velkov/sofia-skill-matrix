import { Employee } from "../types";
import { ensureDbLoaded, getEmployeeIndexById, db } from "./db";

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

export async function addEmployee(newEmployee: Employee): Promise<Employee> {
  await ensureDbLoaded();
  db.data.employees.push(newEmployee);
  await db.write();
  return newEmployee;
}
