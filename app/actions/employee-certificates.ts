"use server";

import {
  addEmployeeCertificateInDb,
  deleteEmployeeCertificateInDb,
  updateEmployeeCertificatesInDb,
} from "@/lib/certificatesDB";
import { Certificate } from "@/types/employees";
import { revalidatePath } from "next/cache";

export async function addEmployeeCertificate(
  employeeId: string,
  certificate: Certificate
) {
  try {
    const data = await addEmployeeCertificateInDb(certificate);
    revalidatePath("/statistics");
    revalidatePath("/");
    return data;
  } catch (error) {
    console.error(
      `❌ Failed to add certificate for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to add certificate.");
  }
}

export async function deleteEmployeeCertificate(
  employeeId: string,
  certificateId: string
) {
  try {
    const data = await deleteEmployeeCertificateInDb(employeeId, certificateId);
    revalidatePath("/statistics");
    revalidatePath("/");
    return data;
  } catch (error) {
    console.error(
      `❌ Failed to delete certificate ${certificateId} for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to delete certificate.");
  }
}

export async function updateEmployeeCertificate(certificates: Certificate) {
  try {
    const data = await updateEmployeeCertificatesInDb(certificates);
    revalidatePath("/statistics");
    revalidatePath("/");
    return data;
  } catch (error) {
    console.error(`❌ Failed to update certificates`, error);
    throw new Error("Unable to update certificates.");
  }
}
