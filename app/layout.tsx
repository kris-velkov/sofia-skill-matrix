import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/navigation/header";

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
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="flex flex-col min-h-screen bg-gray-50 w-full">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
