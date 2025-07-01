import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface EmployeeSkillsInfoProps {
  skills: SkillCategory[];
}

const levelColors = [
  {
    bar: "bg-gray-300",
    text: "text-gray-500",
    label: "No Competency",
  },
  {
    bar: "bg-red-400",
    text: "text-red-600",
    label: "Some knowledge",
  },
  {
    bar: "bg-yellow-400",
    text: "text-yellow-700",
    label: "Working knowledge",
  },
  {
    bar: "bg-blue-400",
    text: "text-blue-700",
    label: "Good proficiency",
  },
  {
    bar: "bg-green-500",
    text: "text-green-700",
    label: "Expert",
  },
];

export const EmployeeSkillsInfo: React.FC<EmployeeSkillsInfoProps> = ({
  skills,
}) => {
  const maxLevel = 4;

  const categoriesWithSkills = skills.filter(
    (category) => category.skills && category.skills.length > 0
  );

  return (
    <Card className="p-10 shadow-2xl border-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/60 rounded-3xl">
      <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-extrabold text-blue-900 flex items-center gap-4 tracking-tight">
          <Award className="h-8 w-8 text-blue-500 drop-shadow" />
          <span>Skills Overview</span>
        </CardTitle>
      </CardHeader>
      {categoriesWithSkills.length > 0 ? (
        <div className="space-y-14">
          {categoriesWithSkills.map((category, idx) => (
            <div key={category.name}>
              <div className="flex items-center gap-4 mb-5">
                <h3 className="text-xl font-bold  text-blue-900 tracking-wide">
                  {category.name}
                </h3>
                <Badge className="px-3 py-1 rounded-full bg-blue-100 text-sm font-semibold text-blue-700 shadow-sm flex items-center gap-1">
                  <Award className="w-4 h-4 text-blue-400" />
                  {category.skills.length} skill
                  {category.skills.length > 1 ? "s" : ""}
                </Badge>
                {!!category.averageLevel && (
                  <Badge className="px-3 py-1 rounded-full bg-blue-100 text-sm font-semibold text-green-700 shadow-sm flex items-center gap-1">
                    <Award className="w-4 h-4 text-green-800" />
                    Avg: {category.averageLevel}
                  </Badge>
                )}
              </div>
              <div className="space-y-6">
                {category.skills.map((skill) => {
                  const color = levelColors[skill.level] || levelColors[0];
                  return (
                    <div
                      key={skill.name}
                      className="flex items-center gap-6 px-4 py-2 rounded-2xl bg-white/90 hover:shadow-lg transition border border-blue-50"
                    >
                      <span className="min-w-[150px] font-semibold text-normal">
                        {skill.name}
                      </span>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="relative w-full h-2 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                          <div
                            className={cn(
                              color.bar,
                              "absolute left-0 top-0 h-2 rounded-full transition-all"
                            )}
                            style={{
                              width: `${(skill.level / maxLevel) * 100}%`,
                              boxShadow: `0 2px 8px 0 ${
                                skill.level > 0
                                  ? "rgba(59,130,246,0.12)"
                                  : "transparent"
                              }`,
                            }}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-xs font-semibold mt-1 ml-1",
                            color.text
                          )}
                        >
                          {color.label}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "font-bold min-w-[48px] text-right",
                          color.text
                        )}
                      >
                        {skill.level}/{maxLevel}
                      </span>
                    </div>
                  );
                })}
              </div>
              {idx !== categoriesWithSkills.length - 1 && (
                <Separator className="my-12 bg-gradient-to-r from-blue-200 via-blue-50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-blue-600 italic text-center py-12 text-lg">
          No skills listed for this employee.
        </p>
      )}
    </Card>
  );
};

export default EmployeeSkillsInfo;
