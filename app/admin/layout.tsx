import AdminOnlyWrapper from "@/components/auth/admin-only-wrapper";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Panel – Jakala Skill Matrix",
  description:
    "Administrative interface for managing users, categories, and AI tools.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <AdminOnlyWrapper>{children}</AdminOnlyWrapper>;
}
