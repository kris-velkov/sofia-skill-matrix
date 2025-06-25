import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Linkedin, Trash2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Employee } from "@/lib/types";
import React from "react";

interface EmployeeEditHeaderProps {
  employee: Employee;
  isAdmin: boolean;
  onDelete: () => void;
}

export function EmployeeEditHeader({
  employee,
  isAdmin,
  onDelete,
}: EmployeeEditHeaderProps) {
  return (
    <Card className="p-6 shadow-md rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={
              employee.slackProfileImage ||
              "/placeholder.svg?height=64&width=64&query=user+profile+avatar"
            }
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover border-2 border-blue-500 shadow-sm"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              {employee.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {employee.department} &bull; {employee.cityState || "N/A"},{" "}
              {employee.country || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-10 w-10"
            asChild
          >
            {employee.linkedinUrl ? (
              <a
                href={employee.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5 text-blue-600" />
              </a>
            ) : (
              <Linkedin className="h-5 w-5 text-gray-500" />
            )}
          </Button>
          {isAdmin && (
            <Button
              variant="destructive"
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Employee
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
