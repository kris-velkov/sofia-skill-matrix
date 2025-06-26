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
    <section className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 border border-gray-200 dark:border-gray-800 cursor-pointer block group">
      <Link
        href={`/employees/${employee.id}`}
        aria-label={`View details for ${employee.name}`}
        prefetch={false}
        tabIndex={0}
        className="block focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <CardContent className="p-4 flex flex-col gap-5">
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

          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
            <LucideClock className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
            <span className="font-medium">{employee.careerExperience}</span>
          </div>

          <div className="mb-1  h-20 max-h-20 overflow-hidden">
            <EmployeeTopSkills skills={topSkills} />
          </div>
        </CardContent>
      </Link>
      {employee.slackUrl && (
        <div className="mt-2 h-15 max-h-15">
          <EmployeeSlackLink
            slackUrl={employee.slackUrl}
            name={employee.name}
          />
        </div>
      )}
    </section>
  );
}
