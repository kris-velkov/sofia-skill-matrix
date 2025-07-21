import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { SkillCategory } from "@/types/employees";
import { Badge } from "@/components/ui/badge";
import { COMPETENCY_LEVELS } from "@/constants/competency-level";

interface EmployeeSkillsInfoProps {
  skills: SkillCategory[];
}

export const EmployeeSkillsInfo: React.FC<EmployeeSkillsInfoProps> = ({
  skills,
}) => {
  const maxLevel = 4;

  const categoriesWithSkills = skills.filter(
    (category) => category.skills && category.skills.length > 0
  );

  return (
    <Card className="p-4 md:p-10 shadow-2xl border-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/60 rounded-3xl">
      <CardHeader className="p-0 mb-4 md:mb-8 flex flex-col md:flex-row items-start md:items-center justify-between">
        <CardTitle className="text-xl md:text-2xl font-extrabold text-blue-900 flex items-center gap-2 md:gap-4 tracking-tight">
          <Award className="h-6 w-6 md:h-8 md:w-8 text-blue-500 drop-shadow" />
          <span>Skills Overview</span>
        </CardTitle>
      </CardHeader>
      {categoriesWithSkills.length > 0 ? (
        <div className="space-y-8 md:space-y-14">
          {categoriesWithSkills.map((category, idx) => (
            <div key={category.name}>
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3 md:mb-5">
                <h3 className="text-lg md:text-xl font-bold text-blue-900 tracking-wide">
                  {category.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-blue-100 text-xs md:text-sm font-semibold text-blue-700 shadow-sm flex items-center gap-1">
                    <Award className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
                    {category.skills.length} skill
                    {category.skills.length > 1 ? "s" : ""}
                  </Badge>
                  {!!category.averageLevel && (
                    <Badge className="px-2 md:px-3 py-0.5 md:py-1 rounded-full bg-blue-100 text-xs md:text-sm font-semibold text-green-700 shadow-sm flex items-center gap-1">
                      <Award className="w-3 h-3 md:w-4 md:h-4 text-green-800" />
                      Avg: {category.averageLevel}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-4 md:space-y-6">
                {category.skills.map((skill) => {
                  const item =
                    COMPETENCY_LEVELS[skill.level] || COMPETENCY_LEVELS[0];
                  return (
                    <div
                      key={skill.name}
                      className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 px-3 md:px-4 py-2 rounded-2xl bg-white/90 hover:shadow-lg transition border border-blue-50"
                    >
                      <span className="font-semibold text-sm md:text-normal md:min-w-[150px]">
                        {skill.name}
                      </span>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="relative w-full h-2 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                          <div
                            className={cn(
                              item.bgColor,
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
                        <div className="flex justify-between items-center">
                          <span
                            className={cn(
                              "text-xs font-semibold mt-1 ml-1",
                              item.progressTextColor
                            )}
                          >
                            {item.name}
                          </span>
                          <span
                            className={cn(
                              "text-xs md:text-base font-bold",
                              item.progressTextColor
                            )}
                          >
                            {skill.level}/{maxLevel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {idx !== categoriesWithSkills.length - 1 && (
                <Separator className="my-6 md:my-12 bg-gradient-to-r from-blue-200 via-blue-50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-blue-600 italic text-center py-6 md:py-12 text-base md:text-lg">
          No skills listed for this employee.
        </p>
      )}
    </Card>
  );
};

export default EmployeeSkillsInfo;
