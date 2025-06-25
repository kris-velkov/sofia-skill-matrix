"use client";

import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Employee, Skill } from "@/lib/types";
import { Slack, Pencil, LucideClock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { Circle, Star, CheckCircle, TrendingUp, Award } from "lucide-react";

interface EmployeeAvatarProps {
  src: string;
  alt: string;
}
function EmployeeAvatar({ src, alt }: Readonly<EmployeeAvatarProps>) {
  return (
    <div className="h-12 w-12 min-w-[48px] min-h-[48px] relative flex-shrink-0 rounded-full border-2 border-gray-200 dark:border-gray-700 shadow-md overflow-hidden bg-gray-100 dark:bg-gray-700">
      <Image
        src={src ?? "/placeholder-user.png"}
        alt={alt ?? "Employee profile image"}
        fill
        className="rounded-full object-cover"
        sizes="48px"
        loading="lazy"
        priority={false}
      />
    </div>
  );
}

// EmployeeHeader can be a server component if onEdit is not used
interface EmployeeHeaderProps {
  name: string;
  department: string;
  badge?: string;
  profileImage?: string;
  onEdit: (e: React.MouseEvent) => void;
}
function EmployeeHeader({
  name,
  department,
  badge,
  profileImage,
  onEdit,
}: EmployeeHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <EmployeeAvatar
          src={profileImage ?? "/placeholder-user.png"}
          alt={`${name} profile`}
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {name}
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {department}
            {badge && (
              <>
                {" "}
                &bull;{" "}
                <Badge
                  variant="secondary"
                  className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                >
                  {badge}
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label={`Edit ${name}`}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  );
}

// SkillLevelBadge component with icon and subtle gradient, 4 as best, 0 as lack of knowledge

interface SkillLevelBadgeProps {
  level: number; // 0 (none) to 4 (best)
  children: React.ReactNode;
}

const levelStyles = [
  // 0: lack of knowledge
  "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  // 1: beginner
  "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200",
  // 2: intermediate
  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  // 3: advanced
  "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  // 4: expert (best)
  "bg-purple-200 text-purple-900 dark:bg-purple-800 dark:text-purple-100",
];

const levelIcons = [
  <Circle key={0} className="h-3 w-3" />, // 0: lack of knowledge
  <Star key={1} className="h-3 w-3" />, // 1: beginner
  <TrendingUp key={2} className="h-3 w-3" />, // 2: intermediate
  <CheckCircle key={3} className="h-3 w-3" />, // 3: advanced
  <Award key={4} className="h-3 w-3" />, // 4: expert
];

function SkillLevelBadge({ level, children }: SkillLevelBadgeProps) {
  // Clamp level between 0 and 4
  const safeLevel = Math.max(0, Math.min(4, level));
  const badgeClass =
    "px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-sm " +
    levelStyles[safeLevel];

  return (
    <Badge className={badgeClass}>
      {levelIcons[safeLevel]}
      {children}
    </Badge>
  );
}

// EmployeeTopSkills can be a server component
interface EmployeeTopSkillsProps {
  skills: Skill[];
}
function EmployeeTopSkills({ skills }: EmployeeTopSkillsProps) {
  if (skills.length === 0) return null;
  return (
    <div className="mb-4">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        Top Skills
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillLevelBadge key={skill.name} level={skill.level}>
            <span>{skill.name}</span>
            <span className="inline-block rounded px-1 ml-1 text-[10px] font-bold">
              {skill.level}
            </span>
          </SkillLevelBadge>
        ))}
      </div>
    </div>
  );
}

// EmployeeSlackLink can be a server component
interface EmployeeSlackLinkProps {
  slackUrl: string;
  name: string;
}
function EmployeeSlackLink({ slackUrl, name }: EmployeeSlackLinkProps) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
      <Link
        href={slackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
        onClick={(e) => e.stopPropagation()}
        aria-label={`Connect with ${name} on Slack`}
      >
        <Slack className="h-4 w-4" />
        Connect on Slack
      </Link>
    </div>
  );
}

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
