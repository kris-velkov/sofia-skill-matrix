"use client";

import { memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Employee } from "@/types/employees";

interface EmployeeTableActionsProps {
  employee: Employee;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTableActions = memo(function EmployeeTableActions({
  employee,
  onDelete,
}: EmployeeTableActionsProps) {
  const handleDelete = () => {
    onDelete(employee);
  };

  return (
    <div className="flex justify-end gap-1 sm:gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full text-green-600 hover:bg-green-50 transition-colors"
        asChild
      >
        <Link
          href={`/employee/${employee.id}`}
          aria-label={`View ${employee.firstName} ${employee.lastName}`}
        >
          <Eye className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
        asChild
      >
        <Link
          href={`/employees/${employee.id}/edit`}
          aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
        >
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-full text-red-600 hover:bg-red-50 transition-colors"
        onClick={handleDelete}
        aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
});
