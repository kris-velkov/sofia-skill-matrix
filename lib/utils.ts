import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getEmployeeFullName(
  firstName: string,
  lastName: string
): string {
  return `${firstName} ${lastName}`.trim();
}
