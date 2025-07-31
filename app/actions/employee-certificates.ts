"use server";

import {
  addEmployeeCertificateInDb,
  deleteEmployeeCertificateInDb,
  updateEmployeeCertificatesInDb,
  getEmployeeCertificates as getEmployeeCertificatesFromDb,
} from "@/lib/certificatesDB";
import { Certificate } from "@/types/employees";

export async function addEmployeeCertificate(
  employeeId: string,
  certificate: Certificate
) {
  try {
    return await addEmployeeCertificateInDb(certificate);
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
      `Failed to delete certificate ${certificateId} for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to delete certificate.");
  }
}

export async function updateEmployeeCertificate(certificates: Certificate) {
  try {
    return await updateEmployeeCertificatesInDb(certificates);
  } catch (error) {
    console.error(`Failed to update certificates`, error);
    throw new Error("Unable to update certificates.");
  }
}

export async function getEmployeeCertificates(employeeId: string) {
  try {
    return await getEmployeeCertificatesFromDb(employeeId);
  } catch (error) {
    console.error(
      `Failed to get certificates for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to get certificates.");
  }
}
