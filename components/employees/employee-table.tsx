"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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
import { UserX } from "lucide-react";
import type { Employee } from "@/types/employees";
import { EmployeeAvatar } from "./employee-avatar";
import { EmployeeSearch } from "./employee-search";
import { EmployeeTableActions } from "./employee-table-actions";
import { deleteEmployeeAction } from "@/app/actions/employee-actions";
import { getExperienceFromDate } from "@/lib/utils/experienceDate";
import { capitalizeFirstLetter } from "@/lib/utils/normalize";
import { filterEmployees, debounce } from "@/lib/utils/employeeSearch";
import EmptyState from "../ui/empty-state";
import { Badge } from "../ui/badge";

interface EmployeeTableProps {
  initialEmployees: Employee[];
}

export function EmployeeTable({ initialEmployees }: EmployeeTableProps) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const debouncedSetSearch = useMemo(
    () => debounce((term: string) => setDebouncedSearchTerm(term), 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  useEffect(() => {
    setEmployees(initialEmployees);
  }, [initialEmployees]);

  const filteredEmployees = useMemo(() => {
    return filterEmployees(employees, debouncedSearchTerm);
  }, [employees, debouncedSearchTerm]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const confirmDelete = useCallback((employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirmed = useCallback(async () => {
    if (!employeeToDelete) return;

    try {
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
    } catch (error) {
      toast.error("Failed to delete employee");
      console.error("Delete error:", error);
    } finally {
      setEmployeeToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  }, [employeeToDelete]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  }, []);

  return (
    <div className="w-full shadow-sm border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
                Employees
              </h2>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow transition-all duration-300 px-4 py-1.5 text-sm font-semibold">
                <span className="relative z-10">
                  {filteredEmployees.length}{" "}
                  {filteredEmployees.length === 1 ? "employee" : "employees"}
                </span>
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <EmployeeSearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            className="w-full sm:w-auto sm:min-w-[320px]"
          />
        </div>
      </div>

      <div className="block sm:hidden">
        {filteredEmployees.length === 0 ? (
          <div className="p-8">
            <EmptyState
              message={
                searchTerm
                  ? "No employees found matching your search."
                  : "No employees found."
              }
              icon={<UserX className="w-8 h-8 text-gray-400 mb-2" />}
            />
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <div
                key={employee.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <EmployeeAvatar
                      src={employee.profileImage || ""}
                      alt={`${employee.firstName} ${employee.lastName}`}
                      className="w-10 h-10 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-900 truncate">
                        {employee.firstName} {employee.lastName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        <div className="truncate">
                          {getExperienceFromDate(employee.startDate) ||
                            "No start date"}
                        </div>
                        <div className="truncate">
                          {employee.department || "No department"} •{" "}
                          {employee.role || "No role"}
                        </div>
                        <div className="truncate">
                          {employee.program
                            ? capitalizeFirstLetter(employee.program)
                            : "No program"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-3">
                    <EmployeeTableActions
                      employee={employee}
                      onDelete={confirmDelete}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="hidden sm:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 bg-gray-50">
              <TableHead className="py-3 px-4 text-sm font-semibold text-gray-900">
                Employee
              </TableHead>
              <TableHead className="hidden md:table-cell py-3 px-4 text-sm font-semibold text-gray-900">
                Program
              </TableHead>
              <TableHead className="hidden md:table-cell py-3 px-4 text-sm font-semibold text-gray-900">
                Department
              </TableHead>
              <TableHead className="hidden lg:table-cell py-3 px-4 text-sm font-semibold text-gray-900">
                Start Date
              </TableHead>
              <TableHead className="hidden lg:table-cell py-3 px-4 text-sm font-semibold text-gray-900">
                Experience
              </TableHead>
              <TableHead className="hidden md:table-cell py-3 px-4 text-sm font-semibold text-gray-900">
                Role
              </TableHead>
              <TableHead className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <EmptyState
                    message={
                      searchTerm
                        ? "No employees found matching your search."
                        : "No employees found."
                    }
                    icon={<UserX className="w-8 h-8 text-gray-400 mb-5" />}
                  />
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
                        src={employee.profileImage || ""}
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-10 h-10 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {employee.firstName} {employee.lastName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-3 px-4 text-gray-600 text-sm">
                    {employee.program
                      ? capitalizeFirstLetter(employee.program)
                      : "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-3 px-4 text-gray-600 text-sm">
                    {employee.department || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-3 px-4 text-gray-600 text-sm">
                    {getExperienceFromDate(employee.startDate) || "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell py-3 px-4 text-gray-600 text-sm">
                    {getExperienceFromDate(employee.careerExperience) || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell py-3 px-4 text-gray-600 text-sm">
                    {employee.role || "—"}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right">
                    <EmployeeTableActions
                      employee={employee}
                      onDelete={confirmDelete}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${employeeToDelete?.firstName} ${employeeToDelete?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirmed}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
