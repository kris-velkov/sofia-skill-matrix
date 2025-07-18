"use server";

import { addEmployee, deleteEmployee } from "@/lib/employeeInfoDB";
import { assignDefaultLevelsToEmployee } from "@/lib/skillsDB";
import { Department, Employee } from "@/types/employees";
import { normalizeDepartment } from "@/lib/utils/normalize";
import { revalidatePath } from "next/cache";
import { getEmployeeById } from "@/lib/employees";

export async function addNewEmployee(
  department: Department
): Promise<{ success: boolean; employeeId?: string; message?: string }> {
  const newEmployee: Partial<Employee> = {
    firstName: "New",
    lastName: "Employee",
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
      return {
        success: true,
        employeeId: employee.id,
        message: "Employee created successfully",
      };
    }

    return {
      success: false,
      message: "Failed to create employee",
    };
  } catch (error) {
    console.error("❌ Failed to add new employee:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while creating employee",
    };
  }
}

export async function deleteEmployeeAction(userId: string) {
  try {
    await deleteEmployee(userId);
    revalidatePath("/employees");
    return { success: true, message: "Employee deleted successfully!" };
  } catch (error) {
    console.error("❌ Failed to delete employee:", error);
    return { success: false, message: "Failed to delete employee." };
  }
}

export async function getEmployee(employeeId: string) {
  try {
    return await getEmployeeById(employeeId);
  } catch (error) {
    console.error("❌ Error fetching employee:", error);
    throw new Error("Failed to fetch employee.");
  }
}
