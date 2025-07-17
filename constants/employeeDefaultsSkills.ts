import { EmployeeRole } from "@/types/employees";

export const PROGRAMS = [
  { id: "sirius", name: "Sirius" },
  { id: "polaris", name: "Polaris" },
];

export const ROLES: EmployeeRole[] = [
  { id: "frontend", name: "Front-end", departament: "fe" },
  { id: "backend", name: "Back-end", departament: "be" },
  { id: "qa", name: "QA", departament: "qa" },
  { id: "pm", name: "Project Manager", departament: "pm" },
];
