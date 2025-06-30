import React from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Employee } from "@/lib/types";

export function EmployeeEditBreadcrumbs({
  employee,
}: {
  readonly employee: Employee;
}) {
  const items = [
    { label: "Home", href: "/" },
    { label: "Employees", href: "/employees" },
    { label: employee.name, href: `/employees/${employee.id}` },
    { label: "Edit" },
  ];
  return <Breadcrumbs items={items} />;
}

export function EmployeeEditPageHeader({
  employee,
}: {
  readonly employee: Employee;
}) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        asChild
        className="text-gray-700 hover:bg-gray-100"
      >
        <Link
          href={`/employees/${employee.id}`}
          aria-label="Back to employee profile"
        >
          <ChevronLeft className="h-6 w-6" />
        </Link>
      </Button>
      <h2 className="text-2xl font-bold text-gray-800">
        Edit Employee: {employee.name}
      </h2>
    </div>
  );
}
