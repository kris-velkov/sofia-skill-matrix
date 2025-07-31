"use server";

import { getEmployeeCertificatesInDb } from "@/lib/certificatesDB";
import { requireStatisticsViewing } from "./auth-action";

export async function getAllEmployeesCertificates() {
  try {
    const user = await requireStatisticsViewing();

    return await getEmployeeCertificatesInDb(user.program);
  } catch (error) {
    console.error("Failed to fetch employee certificates:", error);
    throw error;
  }
}
