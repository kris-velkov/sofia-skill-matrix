import ProtectedAdminRoute from "@/components/auth/protected-admin-route";
import React from "react";

export default function EmployeesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedAdminRoute>{children}</ProtectedAdminRoute>;
}
