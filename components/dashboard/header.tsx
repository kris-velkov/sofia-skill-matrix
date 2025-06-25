"use client";

import { LogOut, BarChart2, Users2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { CompetencyLegendTrigger } from "./competency-legend";
import Image from "next/image";

const NAV_LINKS = [
  {
    href: "/employees",
    label: "Manage Employees",
    icon: <Users2 className="mr-2 h-4 w-4" />,
  },
  {
    href: "/statistics",
    label: "Statistics",
    icon: <BarChart2 className="mr-2 h-4 w-4" />,
  },
];

function DashboardBranding() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image
        src="/jakala-logo.webp"
        alt="JAKALA Logo"
        width={130}
        height={50}
        priority
      />
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">
        Skills Matrix Dashboard
      </h1>
    </div>
  );
}

function DashboardNav() {
  return (
    <nav className="flex items-center gap-2">
      {NAV_LINKS.map(({ href, label, icon }) => (
        <Button
          key={href}
          variant="ghost"
          asChild
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Link href={href} className="flex items-center">
            {icon}
            {label}
          </Link>
        </Button>
      ))}
    </nav>
  );
}

export function Header() {
  const { logout } = useAuth();

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <DashboardBranding />
      <nav className="flex items-center gap-2">
        <DashboardNav />
        <CompetencyLegendTrigger />
        <Button
          variant="ghost"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </nav>
    </header>
  );
}

export default Header;
