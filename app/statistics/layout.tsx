import ProtectedAdminRoute from "@/components/auth/protected-admin-route";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Jakala Skill Matrix Statistics ",
  description:
    "Statistics dashboard for managing and visualizing skills within Jakala.",
  generator: "Jakala Skill Matrix - Statistics",
};

export default function StatisticsLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <ProtectedAdminRoute>{children}</ProtectedAdminRoute>;
}
