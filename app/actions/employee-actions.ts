"use server";

import { addEmployee, deleteEmployee } from "@/lib/employeeInfoDB";
import { assignDefaultLevelsToEmployee } from "@/lib/skillsDB";
import { Employee } from "@/types/employees";
import { normalizeDepartment } from "@/lib/utils";
import { revalidatePath } from "next/cache";

type Department = {
  id: string;
  name: string;
};

export async function addNewEmployee(
  department: Department
): Promise<string | undefined> {
  const newEmployee: Partial<Employee> = {
    firstName: "New",
    lastName: "Employee",
    department: department.name,
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
      const departmentName = employee.department || department.name;
      await assignDefaultLevelsToEmployee(
        employee.id,
        normalizeDepartment(departmentName)
      );
      revalidatePath("/employees");
      return employee.id;
    }
  } catch (error) {
    console.error("❌ Failed to add new employee:", error);
    throw new Error(
      `❌ Failed to add new employee: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
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
