"use server";

import type { Certificate, EmployeeCertificate } from "./types";
import { supabaseClient } from "./supabase/supabaseClient";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";

export async function getEmployeeCertificates(
  employeeId: string
): Promise<Certificate[] | undefined> {
  const { data, error } = await supabaseClient
    .from("certificates")
    .select("*")
    .eq("employee_id", employeeId);

  if (error) {
    console.error("Error get certificate:", error);
    throw new Error("Failed to get User certificate");
  }
  return camelcaseKeys(data);
}

export async function addEmployeeCertificateInDb(
  certificate: Omit<Certificate, "id">
): Promise<Certificate[] | undefined> {
  const payload = snakecaseKeys(certificate);

  const { data, error } = await supabaseClient
    .from("certificates")
    .insert(payload)
    .select();

  if (error) {
    throw new Error("Failed to add certificate");
  }

  return camelcaseKeys(data, { deep: true }) as Certificate[];
}

export async function deleteEmployeeCertificateInDb(
  employeeId: string,
  certificateId: string
): Promise<Certificate[] | undefined> {
  const { data, error } = await supabaseClient
    .from("certificates")
    .delete()
    .match({ employee_id: employeeId, id: certificateId })
    .select();

  if (error) {
    console.error("Error deleting certificate:", error);
    throw new Error("Failed to delete certificate");
  }

  return camelcaseKeys(data, { deep: true }) as Certificate[];
}

export async function updateEmployeeCertificatesInDb(
  certificate: Partial<Certificate>
): Promise<Certificate[] | undefined> {
  if (!certificate) {
    throw new Error("Certificate data is missing.");
  }

  const payload = snakecaseKeys(certificate, { deep: true });

  const { data, error } = await supabaseClient
    .from("certificates")
    .update(payload)
    .match({ id: certificate?.id, employee_id: certificate.employeeId })
    .select();

  if (error) {
    console.error("Failed to update certificate:", error.message);
    throw new Error("Database update failed");
  }

  return camelcaseKeys(data, { deep: true }) as Certificate[];
}

export async function getAllEmployeeCertificates(): Promise<
  EmployeeCertificate[]
> {
  const { data, error } = await supabaseClient.from("certificates").select(
    `
        id,
        name,
        issuer,
        date,
        url,
        employee:employees (
          id,
          first_name,
          last_name,
          profile_image,
          department,
          role
        )
      `
  );

  if (error) {
    console.error("Error fetching all employee certificates:", error);
    throw new Error("Failed to fetch employee certificates");
  }

  const normalized = camelcaseKeys(data, { deep: true });

  return normalized.map((cert: any) => ({
    id: cert.id,
    name: cert.name,
    issuer: cert.issuer ?? "Unknown",
    date: cert.date ?? null,
    url: cert.url ?? null,
    employee: {
      id: cert.employee.id,
      name: `${cert.employee.firstName} ${cert.employee.lastName}`,
      profileImage: cert.employee.profileImage ?? null,
      department: cert.employee.department ?? null,
      role: cert.employee.role ?? null,
    },
  }));
}
