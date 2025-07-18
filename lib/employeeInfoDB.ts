"use server";

import { supabaseClient } from "./supabase/supabaseClient";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { Employee, EmployeeReturnType } from "@/types/employees";

export async function addEmployee(
  newEmployee: Partial<Employee>
): Promise<Employee | null> {
  if (!newEmployee) {
    throw new Error(`No new employee to add`);
  }

  const payload = snakecaseKeys(newEmployee, { deep: true }) as Employee;

  const { data, error } = await supabaseClient
    .from("employees")
    .insert([payload])
    .select()
    .single();

  if (error) throw new Error(`Add failed: ${error.message}`);
  if (!data) throw new Error("Insert succeeded but no data returned");

  return camelcaseKeys(data, { deep: true }) as unknown as Employee;
}

export async function updateEmployee(
  updatedEmployee: Employee
): Promise<Employee | undefined> {
  const { error } = await supabaseClient
    .from("employees")
    .update(updatedEmployee)
    .eq("id", updatedEmployee.id);

  if (error) {
    console.error("Error updating employee:", error);
    return undefined;
  }

  return updatedEmployee;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const { error } = await supabaseClient
    .from("employees")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting employee:", error);
    return false;
  }

  return true;
}

export async function updateEmployeeFieldById<T extends keyof Employee>(
  id: string,
  field: T,
  value: Employee[T]
): Promise<EmployeeReturnType | undefined> {
  const { data, error } = await supabaseClient
    .from("employees")
    .update({ [field]: value })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating employee field:", error);
    return undefined;
  }

  return data as EmployeeReturnType;
}

type ReturnEmployee = Omit<Employee, "skills">;

export async function updateEmployeePartial(
  id: string,
  data: Partial<Employee>
): Promise<ReturnEmployee | undefined> {
  const payload = snakecaseKeys(data, { deep: true }) as Employee;
  const { data: updated, error } = await supabaseClient
    .from("employees")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error patching employee:", error);
    throw new Error("Error patching employee:", error);
  }
  return updated as EmployeeReturnType;
}

export async function updateEmployeePersonalInfoInDb(
  employeeId: string,
  data: Partial<Employee>
) {
  if (data.careerExperience === "") data.careerExperience = null;
  if (data.startDate === "") data.startDate = null;

  return updateEmployeePartial(employeeId, data);
}
