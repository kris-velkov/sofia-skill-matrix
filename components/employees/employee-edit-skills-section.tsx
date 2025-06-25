import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, LinkIcon } from "lucide-react";
import type { Employee, SkillCategory, Skill, SkillLevel } from "@/lib/types";
import React from "react";

interface EmployeeEditSkillsSectionProps {
  skills: SkillCategory[];
  isAdmin: boolean;
  db: any;
  onSkillChange: (
    categoryName: string,
    skillName: string,
    field: "level" | "url",
    value: string | SkillLevel
  ) => void;
  onDeleteSkill: (categoryName: string, skillName: string) => void;
  onAddSkill: (categoryName: string) => void;
}

export function EmployeeEditSkillsSection({
  skills,
  isAdmin,
  db,
  onSkillChange,
  onDeleteSkill,
  onAddSkill,
}: EmployeeEditSkillsSectionProps) {
  return (
    <>
      <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-gray-100">
        Skills
      </h3>
      {skills.map((category) => (
        <Card
          key={category.name}
          className="p-4 shadow-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">
              {category.name} (Avg: {category.averageLevel.toFixed(1)})
            </h4>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddSkill(category.name)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            )}
          </div>
          <div className="grid gap-3">
            {category.skills.map((skill) => (
              <div
                key={skill.name}
                className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] items-center gap-2 md:gap-4"
              >
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor={`skill-${skill.name}`}
                    className="text-gray-700 dark:text-gray-300"
                  >
                    {skill.name}
                  </Label>
                  {skill.url && (
                    <a
                      href={skill.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span className="sr-only">
                        View {skill.name} documentation
                      </span>
                    </a>
                  )}
                </div>
                <Select
                  value={String(skill.level)}
                  onValueChange={(value) =>
                    onSkillChange(category.name, skill.name, "level", value)
                  }
                  disabled={!isAdmin}
                >
                  <SelectTrigger className="w-[100px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    {db.getSkillLevels().map((level: SkillLevel) => (
                      <SelectItem
                        key={level}
                        value={String(level)}
                        className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id={`skill-url-${skill.name}`}
                  placeholder="Skill URL (Optional)"
                  value={skill.url ?? ""}
                  onChange={(e) =>
                    onSkillChange(
                      category.name,
                      skill.name,
                      "url",
                      e.target.value
                    )
                  }
                  className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                  disabled={!isAdmin}
                />
                {isAdmin && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteSkill(category.name, skill.name)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                    aria-label={`Delete ${skill.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      ))}
    </>
  );
}
