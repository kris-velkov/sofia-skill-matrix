"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/lib/db";
import type { Employee, SkillCategory } from "@/lib/types";

function formDataToEmployee(
  formData: FormData,
  existingEmployee?: Employee
): Employee {
  let skills: SkillCategory[] = [];
  // Try to parse skills from formData if present (for future extensibility)
  const skillsJson = formData.get("skills");
  if (skillsJson && typeof skillsJson === "string") {
    try {
      skills = JSON.parse(skillsJson);
    } catch {
      // fallback to existingEmployee
      if (existingEmployee) skills = existingEmployee.skills;
    }
  } else if (existingEmployee) {
    skills = existingEmployee.skills;
  }

  return {
    id: existingEmployee?.id ?? crypto.randomUUID(),
    name: formData.get("name") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    bio: formData.get("bio") as string,
    country: formData.get("country") as string,
    cityState: formData.get("cityState") as string,
    postalCode: formData.get("postalCode") as string,
    taxId: formData.get("taxId") as string,
    slackProfileImage: formData.get("slackProfileImage") as string,
    slackUrl: formData.get("slackUrl") as string,
    linkedinUrl: formData.get("linkedinUrl") as string,
    careerExperience: formData.get("careerExperience") as string,
    department: formData.get("department") as string,
    badge: formData.get("badge") as string,
    skills,
  };
}

export async function createEmployee(prevState: unknown, formData: FormData) {
  try {
    const newEmployee = formDataToEmployee(formData);
    await addEmployee(newEmployee);
  } catch (error) {
    console.error("Failed to create employee:", error);
    return { message: "Failed to create employee." };
  }

  revalidatePath("/employees");
  redirect("/employees");
}

export async function updateEmployeeAction(
  prevState: unknown,
  formData: FormData
) {
  const id = formData.get("id") as string;
  const existingEmployee = await getEmployeeById(id);

  if (!existingEmployee) {
    return { success: false, message: "Employee not found." };
  }

  try {
    const updatedEmployeeData = formDataToEmployee(formData, existingEmployee);
    await updateEmployee(updatedEmployeeData);
  } catch (error) {
    console.error("Failed to update employee:", error);
    return { success: false, message: "Failed to update employee." };
  }

  revalidatePath(`/employees/${id}/edit`);
  revalidatePath(`/employees/${id}`);
  revalidatePath("/employees");
  return { success: true, message: "Employee updated successfully!" };
}

// Server Action to update employee skills
export async function updateEmployeeSkillsAction(
  employeeId: string,
  skills: SkillCategory[]
) {
  const existingEmployee = await getEmployeeById(employeeId);

  if (!existingEmployee) {
    return { success: false, message: "Employee not found." };
  }

  try {
    const updatedEmployee = {
      ...existingEmployee,
      skills: skills.map((category) => ({
        ...category,
      })),
    };
    await updateEmployee(updatedEmployee);
    revalidatePath(`/employees/${employeeId}/edit`);
    revalidatePath(`/employees/${employeeId}`);
    revalidatePath("/employees");
    return { success: true, message: "Skills updated successfully!" };
  } catch (error) {
    console.error("Failed to update employee skills:", error);
    return { success: false, message: "Failed to update skills." };
  }
}

// Server Action to delete an employee
export async function deleteEmployeeAction(id: string) {
  try {
    const result = await deleteEmployee(id);
    if (!result) {
      return {
        success: false,
        message: "Employee not found or could not be deleted.",
      };
    }
    revalidatePath("/employees");
    return { success: true, message: "Employee deleted successfully!" };
  } catch (error) {
    console.error("Failed to delete employee:", error);
    return { success: false, message: "Failed to delete employee." };
  }
}

// Server Action to update the current user's profile (assuming first employee is user)
export async function updateProfile(prevState: unknown, formData: FormData) {
  const employees = await getEmployees();
  const currentUser = employees[0];

  if (!currentUser) {
    return { message: "User profile not found." };
  }

  try {
    const updatedProfileData = formDataToEmployee(formData, currentUser);
    const finalProfile = { ...updatedProfileData, id: currentUser.id };
    await updateEmployee(finalProfile);
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { message: "Failed to update profile." };
  }

  revalidatePath("/profile");
  revalidatePath("/");
  return { message: "Profile updated successfully!" };
}

export async function updateEmployeeCertificates(
  employeeId: string,
  certificates: { name: string; url: string }[]
) {
  const existingEmployee = await getEmployeeById(employeeId);

  if (!existingEmployee) {
    return { success: false, message: "Employee not found." };
  }

  try {
    const updatedEmployee = {
      ...existingEmployee,
      certificates: certificates.map((cert) => ({
        name: cert.name,
        url: cert.url,
      })),
    };
    await updateEmployee(updatedEmployee);
    revalidatePath(`/employees/${employeeId}/edit`);
    revalidatePath(`/employees/${employeeId}`);
    revalidatePath("/employees");
    return { success: true, message: "Certificates updated successfully!" };
  } catch (error) {
    console.error("Failed to update employee certificates:", error);
    return { success: false, message: "Failed to update certificates." };
  }
}

export async function deleteEmployeeCertificate(
  employeeId: string,
  certificateName: string
) {
  const existingEmployee = await getEmployeeById(employeeId);

  if (!existingEmployee) {
    return { success: false, message: "Employee not found." };
  }

  try {
    const updatedCertificates = existingEmployee?.certificates.filter(
      (cert) => cert.name !== certificateName
    );
    const updatedEmployee = {
      ...existingEmployee,
      certificates: updatedCertificates,
    };
    await updateEmployee(updatedEmployee);
    revalidatePath(`/employees/${employeeId}/edit`);
    revalidatePath(`/employees/${employeeId}`);
    revalidatePath("/employees");
    return { success: true, message: "Certificate deleted successfully!" };
  } catch (error) {
    console.error("Failed to delete employee certificate:", error);
    return { success: false, message: "Failed to delete certificate." };
  }
}
