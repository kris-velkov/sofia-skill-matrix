"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Award, TrendingUp } from "lucide-react";
import type { Employee } from "@/lib/types";

interface CompactStatsGridProps {
  employees: Employee[];
}

export function CompactStatsGrid({ employees }: CompactStatsGridProps) {
  const totalEmployees = employees.length;

  const departmentCounts = employees.reduce((acc, emp) => {
    const dept = emp.department ?? "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalDepartments = Object.keys(departmentCounts).length;

  const totalSkills = employees.reduce((total, emp) => {
    return (
      total +
      emp.skills.reduce((skillCount, cat) => skillCount + cat.skills.length, 0)
    );
  }, 0);

  const avgSkillsPerEmployee =
    totalEmployees > 0 ? Math.round(totalSkills / totalEmployees) : 0;

  const stats: {
    title: string;
    value: number | string;
    icon: any;
    color: string;
    textColor: string;
  }[] = [
    {
      title: "Total Employees",
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
      title: "Total Skills",
      value: totalSkills,
      icon: Award,
      color: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Avg Skills/Employee",
      value: avgSkillsPerEmployee,
      icon: TrendingUp,
      color: "bg-orange-500",
      textColor: "text-orange-600",
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
