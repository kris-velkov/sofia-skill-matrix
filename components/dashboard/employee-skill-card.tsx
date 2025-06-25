"use client";

import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Employee, SkillLevel } from "@/lib/types";
import {
  BarChart2,
  LucideClock,
  Code,
  Database,
  Cloud,
  GitBranch,
  Package,
  Search,
  Smartphone,
  Globe,
  Zap,
  Server,
  Shield,
  Layout,
  Cpu,
  FileText,
  LinkIcon,
  Leaf,
  Terminal,
  ShoppingCart,
  CheckCircle,
  PenToolIcon as Tool,
  Network,
  Atom,
  ViewIcon as Vue,
  TriangleIcon as Angular,
  PiIcon as Python,
  Slack,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Use next/link directly
import { useRouter } from "next/navigation";

interface EmployeeSkillCardProps {
  employee: Employee;
}

const getSkillLevelColor = (level: SkillLevel) => {
  switch (level) {
    case 0:
      return "bg-skill-0 text-text-skill-0"; // Red background, white text
    case 1:
      return "bg-skill-1 text-text-skill-1"; // Orange background, white text
    case 2:
      return "bg-skill-2 text-text-skill-2"; // Yellow background, dark text for contrast
    case 3:
      return "bg-skill-3 text-text-skill-3"; // Green background, white text
    case 4:
      return "bg-skill-4 text-text-skill-4"; // Blue background, white text
    default:
      return "bg-gray-200 text-gray-800"; // Default fallback
  }
};

// Helper to map skill names to Lucide icons
const getSkillIcon = (skillName: string) => {
  const lowerCaseSkill = skillName.toLowerCase();

  // Specific technologies
  if (lowerCaseSkill.includes("react")) return <Atom className="h-4 w-4" />;
  if (lowerCaseSkill.includes("vue")) return <Vue className="h-4 w-4" />; // Assuming Vue icon exists or falls back
  if (lowerCaseSkill.includes("angular"))
    return <Angular className="h-4 w-4" />; // Assuming Angular icon exists or falls back
  if (lowerCaseSkill.includes("nodejs")) return <Code className="h-4 w-4" />;
  if (lowerCaseSkill.includes("python")) return <Python className="h-4 w-4" />; // Assuming Python icon exists or falls back
  if (lowerCaseSkill.includes("drupal")) return <Leaf className="h-4 w-4" />;
  if (lowerCaseSkill.includes("git")) return <GitBranch className="h-4 w-4" />;
  if (
    lowerCaseSkill.includes("docker") ||
    lowerCaseSkill.includes("kubernetes")
  )
    return <Package className="h-4 w-4" />;
  if (
    lowerCaseSkill.includes("mysql") ||
    lowerCaseSkill.includes("mongodb") ||
    lowerCaseSkill.includes("mssql")
  )
    return <Database className="h-4 w-4" />;
  if (
    lowerCaseSkill.includes("aws") ||
    lowerCaseSkill.includes("gcp") ||
    lowerCaseSkill.includes("azure")
  )
    return <Cloud className="h-4 w-4" />;
  if (
    lowerCaseSkill.includes("jenkins") ||
    lowerCaseSkill.includes("gitlab pipelines")
  )
    return <LinkIcon className="h-4 w-4" />;
  if (
    lowerCaseSkill.includes("solr") ||
    lowerCaseSkill.includes("elasticsearch")
  )
    return <Search className="h-4 w-4" />;
  if (
    lowerCaseSkill.includes("redis") ||
    lowerCaseSkill.includes("varnish") ||
    lowerCaseSkill.includes("memcache")
  )
    return <Zap className="h-4 w-4" />;
  if (lowerCaseSkill.includes("linux admin"))
    return <Server className="h-4 w-4" />;
  if (lowerCaseSkill.includes("security"))
    return <Shield className="h-4 w-4" />;
  if (lowerCaseSkill.includes("networking"))
    return <Network className="h-4 w-4" />;
  if (lowerCaseSkill.includes("mobile") || lowerCaseSkill.includes("hybrid"))
    return <Smartphone className="h-4 w-4" />;
  if (
    lowerCaseSkill.includes("seo") ||
    lowerCaseSkill.includes("gtm") ||
    lowerCaseSkill.includes("matomo")
  )
    return <Globe className="h-4 w-4" />;
  if (lowerCaseSkill.includes("commerce"))
    return <ShoppingCart className="h-4 w-4" />;
  if (lowerCaseSkill.includes("tests"))
    return <CheckCircle className="h-4 w-4" />;

  // General categories
  if (lowerCaseSkill.includes("javascript"))
    return <Code className="h-4 w-4" />;
  if (lowerCaseSkill.includes("data stores"))
    return <Database className="h-4 w-4" />;
  if (lowerCaseSkill.includes("build tools"))
    return <Tool className="h-4 w-4" />;
  if (lowerCaseSkill.includes("ci/cd")) return <LinkIcon className="h-4 w-4" />;
  if (lowerCaseSkill.includes("cmd") || lowerCaseSkill.includes("scripting"))
    return <Terminal className="h-4 w-4" />;
  if (lowerCaseSkill.includes("devops")) return <Cpu className="h-4 w-4" />;
  if (lowerCaseSkill.includes("fe frameworks"))
    return <Layout className="h-4 w-4" />;
  if (lowerCaseSkill.includes("misc languages"))
    return <FileText className="h-4 w-4" />;
  if (
    lowerCaseSkill.includes("hosting") ||
    lowerCaseSkill.includes("virtualization")
  )
    return <Server className="h-4 w-4" />;

  return <BarChart2 className="h-4 w-4" />; // Default fallback icon
};

export function EmployeeSkillCard({ employee }: EmployeeSkillCardProps) {
  // pick top 3 skills
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
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={
                employee.slackProfileImage ||
                "/placeholder.svg?height=48&width=48&query=user+avatar"
              }
              alt={`${employee.name} profile`}
              className="h-12 w-12 rounded-full object-cover border-2 border-blue-400"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                {employee.name}
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {employee.department}
                {employee.badge && (
                  <>
                    {" "}
                    &bull;{" "}
                    <Badge
                      variant="secondary"
                      className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {employee.badge}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* EDIT BUTTON – no nested <a> */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/employees/${employee.id}/edit`);
            }}
            aria-label={`Edit ${employee.name}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <LucideClock className="h-4 w-4 mr-1" />
          <span>{employee.careerExperience}</span>
        </div>

        {topSkills.length > 0 && (
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Top Skills:
            </h4>
            <div className="flex flex-wrap gap-2">
              {topSkills.map((skill) => (
                <Badge
                  key={skill.name}
                  className={cn(
                    "px-2 py-1 text-xs font-medium flex items-center gap-1",
                    getSkillLevelColor(skill.level)
                  )}
                >
                  {getSkillIcon(skill.name)}
                  {skill.name} ({skill.level})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {employee.slackUrl && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.open(employee.slackUrl, "_blank", "noopener,noreferrer");
              }}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              <Slack className="h-4 w-4" />
              Connect on Slack
            </button>
          </div>
        )}
      </CardContent>
    </Link>
  );
}

// Re-export helpers so other components can use them
export { getSkillLevelColor, getSkillIcon };
