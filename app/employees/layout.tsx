import ProtectedAdminRoute from "@/components/auth/protected-admin-route";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Jakala Skill Matrix - Employees Table",
  description:
    "Employees table for managing and visualizing skills within Jakala.",
  generator: "Jakala Skill Matrix - Employees",
};

export default function EmployeesLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <ProtectedAdminRoute>{children}</ProtectedAdminRoute>;
}
