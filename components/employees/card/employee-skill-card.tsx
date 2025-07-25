"use client";

import { CardContent } from "@/components/ui/card";
import { EmployeeCardHeader } from "@/components/employees/card/employee-card-header";
import { EmployeeCardSocialLink } from "@/components/employees/card/employee-linkedin-link";
import type { Employee } from "@/types/employees";
import { LucideClock } from "lucide-react";
import Link from "next/link";
import { EmployeeCardTopSkills } from "./employee-card-top-skills";
import { getExperienceFromDate } from "@/lib/utils/experienceDate";

export interface EmployeeSkillCardProps {
  employee: Employee;
}
export function EmployeeSkillCard({
  employee,
}: Readonly<EmployeeSkillCardProps>) {
  const topSkills = employee.skills
    ? employee.skills
        .filter((_cat, idx) => idx !== 0)
        .flatMap((cat) => cat.skills)
        .sort((a, b) => b.level - a.level)
        .slice(0, 8)
    : [];

  return (
    <section className="w-full max-w-lg bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 border border-gray-200 cursor-pointer block group">
      <Link
        href={`/employee/${employee.id}`}
        aria-label={`View details for ${employee.firstName} ${employee.lastName}`}
        prefetch={true}
        tabIndex={0}
        className="block focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <CardContent className="p-4 flex flex-col gap-5">
          <EmployeeCardHeader
            name={employee.firstName + " " + employee.lastName}
            department={employee.department || ""}
            role={employee.role || undefined}
            profileImage={employee.profileImage || undefined}
            certificates={employee.certificates || undefined}
          />

          <div className="flex items-center text-sm text-gray-500">
            <LucideClock className="h-4 w-4 mr-2 text-indigo-500" />
            <span className="font-medium">
              {getExperienceFromDate(employee.careerExperience)}
            </span>
          </div>
          <div className="mb-1 h-38 max-h-38 overflow-hidden">
            <EmployeeCardTopSkills skills={topSkills} />
          </div>
        </CardContent>
      </Link>
      {employee.linkedinUrl && (
        <div className="mt-2 h-15 max-h-15">
          <EmployeeCardSocialLink
            url={employee.linkedinUrl}
            name={employee.firstName + " " + employee.lastName}
          />
        </div>
      )}
    </section>
  );
}
