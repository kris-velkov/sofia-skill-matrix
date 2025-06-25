"use client";

import { LogOut, User, BarChart2 } from "lucide-react"; // Import BarChart2 icon
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { useSkillsStore } from "@/store/use-skills-store";
import { useEffect, useState } from "react";
import { CompetencyLegendTrigger } from "./competency-legend"; // Import the new trigger
import { ThemeToggle } from "@/components/theme-toggle"; // Import ThemeToggle

export function DashboardHeader() {
  const { logout } = useAuth();
  // The store can return undefined while data is loading -
  // default to an empty array so .length is always safe.
  const employees = useSkillsStore((state) => state.employees) ?? [];
  const [profileImage, setProfileImage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    // Assuming the first employee is the "current user" for profile image
    if (employees.length > 0 && employees[0].slackProfileImage) {
      setProfileImage(employees[0].slackProfileImage);
    } else {
      setProfileImage("/placeholder.svg?height=32&width=32");
    }
  }, [employees]);

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="flex items-center gap-2">
        <img
          src="/placeholder.svg?height=32&width=32"
          alt="JAKALA Logo"
          className="h-8 w-8"
        />
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          Skills Matrix Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <CompetencyLegendTrigger />{" "}
        {/* Add the competency legend trigger here */}
        <Button
          variant="ghost"
          asChild
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Link href="/employees">Manage Employees</Link>
        </Button>
        <Button
          variant="ghost"
          asChild
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Link href="/statistics">
            <BarChart2 className="mr-2 h-4 w-4" />
            Statistics
          </Link>
        </Button>
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          aria-label="Logout"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
