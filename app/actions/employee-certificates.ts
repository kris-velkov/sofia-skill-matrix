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
  certificateId: string
) {
  return await deleteEmployeeCertificateInDb(employeeId, certificateId);
}

export async function updateEmployeeCertificate(
  employeeId: string,
  certificate: Certificate[]
) {
  return await updateEmployeeCertificatesInDb(employeeId, certificate);
}
