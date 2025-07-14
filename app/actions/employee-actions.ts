"use server";

import { addEmployee, deleteEmployee } from "@/lib/employeeInfoDB";
import { Employee } from "@/lib/types";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_CATEGORIES_FE_BE,
  DEFAULT_CATEGORIES_PM,
  DEFAULT_CATEGORIES_QA,
} from "@/constants/employeeDefaultsSkills";

export async function addNewEmployee(departament: {
  id: string;
  name: string;
}): Promise<Employee> {
  let categories = [];

  switch (departament.id) {
    case "frontend":
      categories = DEFAULT_CATEGORIES_FE_BE;
      break;
    case "backend":
      categories = DEFAULT_CATEGORIES_FE_BE;
      break;
    case "pm":
      categories = DEFAULT_CATEGORIES_PM;
      break;
    case "qa":
      categories = DEFAULT_CATEGORIES_QA;
      break;
    default:
      categories = DEFAULT_CATEGORIES_FE_BE;
  }

  const newEmployee: Employee = {
    id: crypto.randomUUID(),
    firstName: "New",
    lastName: "Employee",
    department: departament.name,
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
    skills: categories.map((category) => ({
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
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return { success: false, message: "Failed to delete employee." };
  }

  revalidatePath("/employees");
  return { success: true, message: "Employee deleted successfully!" };
}
