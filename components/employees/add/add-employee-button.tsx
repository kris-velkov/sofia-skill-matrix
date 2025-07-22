"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { addNewEmployee } from "@/app/actions/employee-actions";
import { Department, EmployeeRole } from "@/types/employees";

// Define available roles
const ROLES: EmployeeRole[] = [
  { id: "1", name: "Front-end", departament: "fe" },
  { id: "2", name: "Back-end", departament: "be" },
  { id: "3", name: "QA", departament: "qa" },
  { id: "4", name: "Project Manager", departament: "pm" },
];

export default function AddEmployeeButton() {
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNewEmployee = async (department: Department) => {
    try {
      setIsLoading(true);
      setPopoverOpen(false);

      const employeeId = await addNewEmployee(department);

      if (!employeeId || employeeId instanceof Error) {
        throw new Error(
          employeeId instanceof Error
            ? employeeId.message
            : "Failed to add employee"
        );
      }

      toast.success("Employee added successfully!");
      router.push(`/employees/${employeeId}/edit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error adding employee"
      );
      console.error("Error adding employee:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm py-2 px-4 h-auto"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add New Employee"}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-4 bg-white shadow-xl rounded-xl border border-gray-200">
        <div className="mb-2">
          <p className="text-sm font-semibold text-gray-900">
            Select Department
          </p>
          <Separator className="my-2" />
        </div>

        <div className="space-y-1">
          {ROLES.map((role) => (
            <Button
              key={role.id}
              variant="ghost"
              className="w-full justify-start text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-md px-3 py-2"
              onClick={() => handleAddNewEmployee(role.departament)}
              disabled={isLoading}
            >
              {role.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
