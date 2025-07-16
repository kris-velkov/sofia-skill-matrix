"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, Slack, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getEmployeeFullName } from "@/lib/utils";
import { useState, useCallback } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/employees";
import { deleteEmployeeAction } from "@/app/actions/employee-actions";

interface EmployeeEditHeaderInfoProps {
  employee: Employee;
}

export const EmployeeEditHeaderInfo: React.FC<EmployeeEditHeaderInfoProps> = ({
  employee,
}) => {
  const router = useRouter();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const employeeFullName = getEmployeeFullName(
    employee.firstName,
    employee.lastName
  );

  const handleDeleteEmployee = useCallback(() => {
    setConfirmDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const result = await deleteEmployeeAction(employee.id);
    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
      router.push("/employees");
    }
    setConfirmDialogOpen(false);
  }, [employee.id, router]);

  return (
    <>
      <Card className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl border-0 bg-gradient-to-tr from-blue-100/60 to-white">
        <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-blue-400 shadow-lg">
          <AvatarImage
            src={
              employee.profileImage ||
              "/placeholder.svg?height=128&width=128&query=user+avatar"
            }
            alt={`${employee.firstName} profile`}
          />
        </Avatar>
        <div className="flex-1 text-center md:text-left space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-lg text-gray-600">
            {employee.department}
            {employee.city && ` • ${employee.city}`}
            {employee.country && `• ${employee.country}`}
            {employee.program && `• ${employee.program}`}
          </p>
          {employee.role && (
            <Badge className="mt-2 px-4 py-1 text-base bg-blue-200 text-blue-800 font-semibold shadow">
              {employee.role}
            </Badge>
          )}
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          {employee.linkedinUrl && (
            <a
              href={employee.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition-colors hover:bg-blue-200 hover:text-blue-900 shadow"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          )}
          {employee.slackUrl && (
            <a
              href={employee.slackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition-colors hover:bg-blue-200 hover:text-blue-900 shadow"
              aria-label="Slack Profile"
            >
              <Slack className="h-6 w-6" />
            </a>
          )}
        </div>
        <div className="flex flex-col gap-4 mt-6 md:mt-0 items-center">
          <Button
            variant="destructive"
            onClick={handleDeleteEmployee}
            className="bg-red-600 hover:bg-red-700 text-white mt-2"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Employee
          </Button>
        </div>
      </Card>
      <ConfirmDialog
        open={confirmDialogOpen}
        title={`Delete ${employeeFullName}?`}
        description={`Are you sure you want to delete ${employeeFullName}? This action cannot be undone.`}
        onCancel={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default EmployeeEditHeaderInfo;
