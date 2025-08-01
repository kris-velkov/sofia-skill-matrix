"use client";

import { useState, useEffect } from "react";
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
import { Department, DepartmentLabels } from "@/types/employees";
import { getAllRoles } from "@/app/actions/roles-actions";

export default function AddEmployeeButton() {
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const roles = await getAllRoles();
        const uniqueDepartments = Array.from(
          new Set(roles.map((role) => role.departament))
        ) as Department[];
        setDepartments(uniqueDepartments);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setDepartments(["fe", "be", "qa", "pm", "co"]);
      }
    };

    fetchDepartments();
  }, []);

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
          {departments.map((department) => (
            <Button
              key={department}
              variant="ghost"
              className="w-full justify-start text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-md px-3 py-2"
              onClick={() => handleAddNewEmployee(department)}
              disabled={isLoading}
            >
              {DepartmentLabels[department]}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
