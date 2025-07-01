"use server";

import { addEmployee, deleteEmployee } from "@/lib/employeeInfoDB";
import { Employee } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { DEFAULT_CATEGORIES } from "@/constants/employeeDefaultsSkills";

export async function addNewEmployee(): Promise<Employee> {
  const newEmployee: Employee = {
    id: crypto.randomUUID(),
    firstName: "New",
    lastName: "Employee",
    department: "Backend",
    careerExperience: "",
    email: "",
    phone: "",
    bio: "",
    country: "Bulgaria",
    city: "",
    slackProfileImage: "",
    slackUrl: "",
    linkedinUrl: "",
    badge: "",
    certificates: [],
    skills: DEFAULT_CATEGORIES.map((cat) => ({
      name: cat.name,
      skills: cat.skills.map((skill) => ({
        name: skill.name,
        level: skill.level as 0 | 1 | 2 | 3 | 4,
      })),
      averageLevel: 0,
    })),
  };

  const result = await addEmployee(newEmployee);
  revalidatePath("/employees");
  return result;
}

export async function deleteEmployeeAction(userId: string) {
  try {
    await deleteEmployee(userId);
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return { success: false, message: "Failed to delete employee." };
  }

  revalidatePath("/employees");
  return { success: true, message: "Employee deleted successfully!" };
}
