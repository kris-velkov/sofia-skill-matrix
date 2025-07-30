"use server";

import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { Certificate, EmployeeCertificate } from "@/types/employees";
import { EMPLOYEE_CERTIFICATE_QUERY } from "./supabase/queries";
import { createSupabaseServerClient } from "./supabase/server";
import { ProgramValue } from "@/constants/programs";

export async function getEmployeeCertificates(
  employeeId: string
): Promise<Certificate[] | undefined> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("employee_id", employeeId)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error get certificate:", error);
    throw new Error("Failed to get User certificate");
  }
  return camelcaseKeys(data) as unknown as Certificate[];
}

export async function addEmployeeCertificateInDb(
  certificate: Omit<Certificate, "id">
): Promise<Certificate[] | undefined> {
  const payload = snakecaseKeys(certificate);
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
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
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
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
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
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

export async function getEmployeeCertificatesInDb(
  program: ProgramValue
): Promise<EmployeeCertificate[]> {
  const supabase = await createSupabaseServerClient();

  let query = supabase
    .from("certificates")
    .select(EMPLOYEE_CERTIFICATE_QUERY)
    .order("created_at", { ascending: false });

  if (program && program !== "all") {
    query = query.eq("employee.program", program);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching employee certificates:", error);
    throw new Error("Failed to fetch employee certificates");
  }

  return camelcaseKeys(data, {
    deep: true,
  }) as unknown as EmployeeCertificate[];
}
