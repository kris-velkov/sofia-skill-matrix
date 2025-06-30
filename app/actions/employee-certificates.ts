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
  return await addEmployeeCertificateInDb(employeeId, certificate);
}

export async function deleteEmployeeCertificate(
  employeeId: string,
  certificateName: string
) {
  return await deleteEmployeeCertificateInDb(employeeId, certificateName);
}

export async function updateEmployeeEmployeeCertificates(
  employeeId: string,
  certificates: Certificate[]
) {
  return await updateEmployeeCertificatesInDb(employeeId, certificates);
}
