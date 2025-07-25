import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/navigation/header";
import { AuthProvider } from "@/components/auth/auth-provider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Jakala Skill Matrix Dashboard",
  description: "A dashboard for managing and visualizing skills within Jakala.",
  generator: "Jakala Skill Matrix",
  applicationName: "Jakala Dashboard",
  keywords: [
    "Jakala",
    "Skills Matrix",
    "Dashboard",
    "Employee Skills",
    "Visualization",
  ],
  authors: [
    {
      name: "Kristiyan Velkov",
      url: "https://www.linkedin.com/in/kristiyan-velkov-763130b3/",
    },
  ],
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

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="w-full bg-gray-100">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
