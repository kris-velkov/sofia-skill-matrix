import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Toaster } from "@/components/toaster";
import Header from "@/components/dashboard/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Jakala Skill Matrix Dashboard",
  description: "A dashboard for managing and visualizing skills within Jakala.",
  generator: "Jakala Skill Matrix",
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <div className="flex flex-col min-h-screen bg-gray-50">
          <main className="flex-1 p-4 md:p-6 mt-10"> {children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
