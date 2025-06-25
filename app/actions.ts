"use server";

import { db } from "@/lib/db";
import { Employee } from "@/lib/types";

export async function updateProfile(userId: string, formData: FormData) {
  try {
    const existingEmployee = await db.getEmployeeById(userId);
    if (!existingEmployee) {
      throw new Error("User not found for profile update.");
    }

    // Only allow updating profile-related fields
    const updatedFields: Partial<Employee> = {
      name: (formData.get("name") as string) || existingEmployee.name,
      firstName: (formData.get("firstName") as string) || undefined,
      lastName: (formData.get("lastName") as string) || undefined,
      email: (formData.get("email") as string) || undefined,
      bio: (formData.get("bio") as string) || undefined,
      slackProfileImage:
        (formData.get("slackProfileImage") as string) || undefined,
      slackUrl: (formData.get("slackUrl") as string) || undefined,
      linkedinUrl: (formData.get("linkedinUrl") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      country: (formData.get("country") as string) || undefined,
      cityState: (formData.get("cityState") as string) || undefined,
      postalCode: (formData.get("postalCode") as string) || undefined,
    };

    const updatedEmployee: Employee = {
      ...existingEmployee,
      ...updatedFields,
      skills: existingEmployee.skills, // Preserve skills
    };

    await db.updateEmployee(updatedEmployee);
    return { success: true, message: "Profile updated successfully!" };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: error.message ?? "Failed to update profile.",
    };
  }
}
