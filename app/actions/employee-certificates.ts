"use server";

import {
  addEmployeeCertificateInDb,
  deleteEmployeeCertificateInDb,
  updateEmployeeCertificatesInDb,
} from "@/lib/certificatesDB";
import { Certificate } from "@/lib/types";

export async function addEmployeeCertificate(
  employeeId: string,
  certificate: { name: string; url?: string }
) {
  try {
    return await addEmployeeCertificateInDb(employeeId, certificate);
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
    return await deleteEmployeeCertificateInDb(employeeId, certificateId);
  } catch (error) {
    console.error(
      `❌ Failed to delete certificate ${certificateId} for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to delete certificate.");
  }
}

export async function updateEmployeeCertificate(
  employeeId: string,
  certificates: Certificate[]
) {
  try {
    return await updateEmployeeCertificatesInDb(employeeId, certificates);
  } catch (error) {
    console.error(
      `❌ Failed to update certificates for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to update certificates.");
  }
}
