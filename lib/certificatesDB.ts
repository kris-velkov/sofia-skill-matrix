"use server";

import { supabaseClient } from "./supabase/supabaseClient";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { Certificate, EmployeeCertificate } from "@/types/employees";
import { EMPLOYEE_CERTIFICATE_QUERY } from "./supabase/queries";
import { cache } from "react";

export async function getEmployeeCertificates(
  employeeId: string
): Promise<Certificate[] | undefined> {
  const { data, error } = await supabaseClient
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

export const getAllEmployeeCertificates = cache(
  async (): Promise<EmployeeCertificate[]> => {
    const { data, error } = await supabaseClient
      .from("certificates")
      .select(EMPLOYEE_CERTIFICATE_QUERY)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching all employee certificates:", error);
      throw new Error("Failed to fetch employee certificates");
    }

    return camelcaseKeys(data, {
      deep: true,
    }) as unknown as EmployeeCertificate[];
  }
);
