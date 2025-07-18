"use server";

import { addEmployee, deleteEmployee } from "@/lib/employeeInfoDB";
import { assignDefaultLevelsToEmployee } from "@/lib/skillsDB";
import { Department, Employee } from "@/types/employees";
import { normalizeDepartment } from "@/lib/utils/normalize";
import { revalidatePath } from "next/cache";
import { getEmployeeById } from "@/lib/employees";

export async function addNewEmployee(
  department: Department
): Promise<string | Error | undefined> {
  const newEmployee: Partial<Employee> = {
    firstName: "",
    lastName: "",
    department: department,
    floatId: "",
    bio: "",
    country: "Bulgaria",
    city: "Sofia",
    profileImage: "",
    slackUrl: "",
    linkedinUrl: "",
    role: "",
  };
  try {
    const employee = await addEmployee(newEmployee);

    if (employee) {
      const departmentName = employee.department || department;
      const normalizedDept = normalizeDepartment(departmentName);

      await assignDefaultLevelsToEmployee(employee.id, normalizedDept);

      revalidatePath("/employees");
      revalidatePath("/");
      return employee.id;
    }
    throw new Error("Failed to create employee");
  } catch (error) {
    return error as Error;
  }
}

export async function deleteEmployeeAction(userId: string) {
  try {
    await deleteEmployee(userId);
    revalidatePath("/employees");
    revalidatePath("/");
    return { success: true, message: "Employee deleted successfully!" };
  } catch (error) {
    console.error("❌ Failed to delete employee:", error);
    return { success: false, message: "Failed to delete employee." };
  }
}

export async function getEmployee(employeeId: string) {
  try {
    const employee = await getEmployeeById(employeeId);
    return employee;
  } catch (error) {
    console.error("❌ Error fetching employee:", error);
    throw new Error("Failed to fetch employee.");
  }
}
