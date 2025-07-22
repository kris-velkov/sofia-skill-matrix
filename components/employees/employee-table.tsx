"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import type { Employee } from "@/types/employees";
import { EmployeeAvatar } from "./employee-avatar";
import { deleteEmployeeAction } from "@/app/actions/employee-actions";
import { getExperienceFromDate } from "@/lib/utils/experienceDate";

interface EmployeeTableProps {
  initialEmployees: Employee[];
}

export function EmployeeTable({
  initialEmployees,
}: Readonly<EmployeeTableProps>) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");

  useMemo(() => {
    if (initialEmployees) {
      initialEmployees.sort((a, b) => {
        if (a.department && b.department) {
          return a.department.localeCompare(b.department);
        }
        return 0;
      });
      setEmployees(initialEmployees);
    }
  }, [initialEmployees]);

  const confirmDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (employeeToDelete) {
      const result = await deleteEmployeeAction(employeeToDelete.id);
      if (result?.success === false) {
        toast.error(result.message);
      } else {
        setEmployees((prev) =>
          prev.filter((emp) => emp.id !== employeeToDelete.id)
        );
        toast.success(
          `${employeeToDelete.firstName} ${employeeToDelete.lastName} ${result.message}`
        );
      }
      setEmployeeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return employees;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return employees.filter((employee) => {
      if (employee.firstName && employee.lastName) {
        return (
          employee?.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
          employee?.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
          (employee?.department?.toLowerCase() || "").includes(
            lowerCaseSearchTerm
          ) ||
          (employee.role?.toLowerCase() || "").includes(lowerCaseSearchTerm) ||
          (employee.program?.toLowerCase() || "").includes(lowerCaseSearchTerm)
        );
      }
      return false;
    });
  }, [employees, searchTerm]);

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="p-3 sm:p-4 border-b border-gray-100">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search employees by name, department, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 h-9 text-sm border-gray-200 rounded-md w-full"
          />
        </div>
      </div>

      {/* Mobile View - Card Layout */}
      <div className="block sm:hidden">
        {filteredEmployees.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No employees found.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredEmployees.map((employee) => (
              <div key={employee.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar
                      src={employee.profileImage}
                      alt={`${employee.firstName} ${employee.lastName}`}
                      className="w-10 h-10"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <div>{employee.department || ""}</div>
                        <div>{employee.role || ""}</div>
                        <div>{employee.program || "Back-end"}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full text-green-600"
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
                      className="h-8 w-8 p-0 rounded-full text-gray-600"
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
                      className="h-8 w-8 p-0 rounded-full text-red-600"
                      onClick={() => confirmDelete(employee)}
                      aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tablet and Desktop View - Table Layout */}
      <div className="hidden sm:block overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="py-3 px-4 text-sm font-medium text-gray-900">
                Employee
              </TableHead>
              <TableHead className="hidden md:table-cell py-3 px-4 text-sm font-medium text-gray-900">
                Program
              </TableHead>
              <TableHead className="hidden md:table-cell py-3 px-4 text-sm font-medium text-gray-900">
                Department
              </TableHead>
              <TableHead className="hidden lg:table-cell py-3 px-4 text-sm font-medium text-gray-900">
                Hired On
              </TableHead>
              <TableHead className="hidden lg:table-cell py-3 px-4 text-sm font-medium text-gray-900">
                Career Experience
              </TableHead>
              <TableHead className="hidden md:table-cell py-3 px-4 text-sm font-medium text-gray-900">
                Role
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-gray-500"
                >
                  No employees found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <EmployeeAvatar
                        src={employee.profileImage}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-10 h-10"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-3 px-4 text-gray-700 text-sm">
                    {employee.program || "N/A"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-3 px-4 text-gray-700 text-sm">
                    {employee.department || "N/A"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-3 px-4 text-gray-700 text-sm">
                    {getExperienceFromDate(employee.startDate)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-3 px-4 text-gray-700 text-sm">
                    {getExperienceFromDate(employee.careerExperience)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-3 px-4 text-gray-700 text-sm">
                    {employee.role || "N/A"}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full text-green-600 hover:bg-green-50"
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
                        className="h-8 w-8 p-0 rounded-full text-gray-600 hover:bg-gray-50"
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
                        className="h-8 w-8 p-0 rounded-full text-red-600 hover:bg-red-50"
                        onClick={() => confirmDelete(employee)}
                        aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${employeeToDelete?.firstName} ${employeeToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirmed}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setEmployeeToDelete(null);
        }}
      />
    </div>
  );
}
