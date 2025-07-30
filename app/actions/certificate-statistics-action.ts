"use server";

import { getEmployeeCertificatesInDb } from "@/lib/certificatesDB";
import { requireAuth } from "./auth-action";

export async function getAllEmployeesCertificates() {
  try {
    const user = await requireAuth();

    if (user.role !== "admin" && !user.program) {
      throw new Error(
        "Access denied: Admin role required or valid program not found."
      );
    }

    return await getEmployeeCertificatesInDb(user.program);
  } catch (error) {
    console.error("Failed to fetch employee certificates:", error);
    throw new Error("Unable to load employee certificates at this time.");
  }
}
