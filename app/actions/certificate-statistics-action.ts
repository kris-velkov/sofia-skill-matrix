"use server";

import { getAllEmployeeCertificates } from "@/lib/certificatesDB";

export async function getAllEmployeesCertificates() {
  try {
    return await getAllEmployeeCertificates();
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    throw new Error("Unable to load employees at this time.");
  }
}
