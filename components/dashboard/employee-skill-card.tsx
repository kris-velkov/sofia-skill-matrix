"use client";

import { CardContent } from "@/components/ui/card";
import { EmployeeHeader } from "@/components/employees/employee-header";
import { EmployeeTopSkills } from "@/components/employees/employee-top-skills";
import { EmployeeSlackLink } from "@/components/employees/employee-slack-link";
import type { Employee } from "@/lib/types";
import { LucideClock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface EmployeeSkillCardProps {
  employee: Employee;
}
export function EmployeeSkillCard({ employee }: EmployeeSkillCardProps) {
  const topSkills = employee.skills
    .flatMap((cat) => cat.skills)
    .sort((a, b) => b.level - a.level)
    .slice(0, 3);

  const router = useRouter();

  return (
    <Link
      href={`/employees/${employee.id}`}
      className="w-full max-w-xs bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer block"
      aria-label={`View details for ${employee.name}`}
      prefetch={false}
    >
      <CardContent className="p-4">
        <EmployeeHeader
          name={employee.name}
          department={employee.department}
          badge={employee.badge}
          profileImage={employee.slackProfileImage}
          onEdit={(e) => {
            e.stopPropagation();
            router.push(`/employees/${employee.id}/edit`);
          }}
        />

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <LucideClock className="h-4 w-4 mr-1" />
          <span>{employee.careerExperience}</span>
        </div>

        <EmployeeTopSkills skills={topSkills} />

        {employee.slackUrl && (
          <EmployeeSlackLink
            slackUrl={employee.slackUrl}
            name={employee.name}
          />
        )}
      </CardContent>
    </Link>
  );
}
