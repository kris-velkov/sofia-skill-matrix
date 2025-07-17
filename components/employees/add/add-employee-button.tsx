"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { addNewEmployee } from "@/app/actions/employee-actions";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ROLES } from "@/constants/employeeDefaultsSkills";

export const AddEmployeeButton: React.FC = () => {
  const router = useRouter();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleAddNewEmployee = async (departament: string) => {
    try {
      setPopoverOpen(false);
      const employeeId = await addNewEmployee(departament);
      if (!employeeId) throw new Error("Failed to add employee");
      toast.success("Employee added successfully!");
      router.push(`/employees/${employeeId}/edit`);
    } catch (error) {
      toast.error("Error adding employee.");
      console.error("Error adding employee:", error);
    }
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow flex items-center gap-2"
        >
          Add New Employee
          <ChevronDown className="h-4 w-4 ml-1" />
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
          {ROLES.length > 0 ? (
            ROLES.map((role) => (
              <Button
                key={role.id}
                variant="ghost"
                className="w-full justify-start text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors rounded-md px-3 py-2"
                onClick={() => handleAddNewEmployee(role.departament)}
              >
                {role.name}
              </Button>
            ))
          ) : (
            <p className="text-sm text-gray-500 px-2 py-1 italic">
              No departments found.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddEmployeeButton;
