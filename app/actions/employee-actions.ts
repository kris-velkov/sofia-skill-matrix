"use server";

import { addEmployee, deleteEmployee } from "@/lib/employeeInfoDB";
import { Employee } from "@/lib/types";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_CATEGORIES_FE_BE,
  DEFAULT_CATEGORIES_PM,
  DEFAULT_CATEGORIES_QA,
} from "@/constants/employeeDefaultsSkills";

type Department = {
  id: string;
  name: string;
};

export async function addNewEmployee(
  department: Department
): Promise<Employee> {
  const defaultCategories = (() => {
    switch (department.id) {
      case "frontend":
      case "backend":
        return DEFAULT_CATEGORIES_FE_BE;
      case "pm":
        return DEFAULT_CATEGORIES_PM;
      case "qa":
        return DEFAULT_CATEGORIES_QA;
      default:
        return DEFAULT_CATEGORIES_FE_BE;
    }
  })();

  const newEmployee: Employee = {
    id: crypto.randomUUID(),
    firstName: "New",
    lastName: "Employee",
    department: department.name,
    floatId: "",
    careerExperience: "",
    bio: "",
    country: "Bulgaria",
    city: "Sofia",
    profileImage: "",
    slackUrl: "",
    linkedinUrl: "",
    role: "",
    certificates: [],
    skills: defaultCategories.map((category) => ({
      name: category.name,
      skills: category.skills.map((skill) => ({
        name: skill.name,
        level: skill.level as 0,
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
    revalidatePath("/employees");
    return { success: true, message: "Employee deleted successfully!" };
  } catch (error) {
    console.error("❌ Failed to delete employee:", error);
    return { success: false, message: "Failed to delete employee." };
  }
}
