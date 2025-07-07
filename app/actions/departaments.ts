"use server";

import { getDepartments } from "@/lib/db";

export async function getDepartmentsAction(): Promise<string[]> {
  const response = await getDepartments();

  if (!response || !Array.isArray(response)) {
    return [];
  } else {
    return response;
  }
}
