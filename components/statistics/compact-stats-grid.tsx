"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Award, LucideIcon } from "lucide-react";
import type { EmployeeCertificate } from "@/types/employees";

interface CompactStatsGridProps {
  employeesCertificates: EmployeeCertificate[];
}

export function CompactStatsGrid({
  employeesCertificates,
}: Readonly<CompactStatsGridProps>) {
  const totalEmployees = new Set(
    employeesCertificates.map((cert) => cert.employee.id)
  ).size;

  const departmentCounts = employeesCertificates.reduce((acc, emp) => {
    const dept = emp.employee.department ?? "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDepartments = Object.keys(departmentCounts).length;

  const totalCertificates = employeesCertificates?.length;

  const stats: {
    title: string;
    value: number | string;
    icon: LucideIcon;
    color: string;
    textColor: string;
  }[] = [
    {
      title: "Total Employees with certificate",
      value: totalEmployees,
      icon: Users,
      color: "bg-blue-500",
      textColor: "text-blue-600",
    },
    {
      title: "Departments",
      value: totalDepartments,
      icon: Building2,
      color: "bg-green-500",
      textColor: "text-green-600",
    },
    {
      title: "Total Certificates",
      value: totalCertificates,
      icon: Award,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
      {stats.map((s) => (
        <Card
          key={s.title}
          className="border border-gray-100 shadow-lg rounded-xl bg-white"
        >
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold text-gray-500 tracking-wide">
              {s.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <span className={`text-3xl font-extrabold tracking-tight`}>
                  {s.value.toLocaleString()}
                </span>
              </div>
              <div
                className={`p-2 rounded-full bg-gray-700 bg-opacity-20 shadow-md`}
              >
                <s.icon className={`h-6 w-6 text-white`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
