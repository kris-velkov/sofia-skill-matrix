"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Award, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SkillCategory, SkillLevel } from "@/lib/types";

interface EmployeeEditSkillsProps {
  skills: SkillCategory[];
  maxLevel?: number;
  onSave: (skills: SkillCategory[]) => void;
  isSaving?: boolean;
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

export const EmployeeEditSkills: React.FC<EmployeeEditSkillsProps> = ({
  skills: initialSkills,
  maxLevel = 4,
  isSaving,
}) => {
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);
  const [saving, setSaving] = useState(false);

  const handleLevelChange = (
    catIdx: number,
    skillIdx: number,
    newLevel: number
  ) => {
    setSkills((prev) => {
      const updated = [...prev];
      updated[catIdx] = {
        ...updated[catIdx],
        skills: updated[catIdx].skills.map((s, i) =>
          i === skillIdx ? { ...s, level: newLevel as SkillLevel } : s
        ),
      };
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaving(false);
  };

  const handleAddCategory = () => {
    setSkills((prev) => [...prev, { name: "New Category", skills: [] }]);
  };

  const handleDeleteCategory = (catIdx: number) => {
    setSkills((prev) => prev.filter((_, idx) => idx !== catIdx));
  };

  const handleAddSkill = (catIdx: number) => {
    setSkills((prev) => {
      const updated = [...prev];
      updated[catIdx] = {
        ...updated[catIdx],
        skills: [...updated[catIdx].skills, { name: "New Skill", level: 0 }],
      };
      return updated;
    });
  };

  const handleDeleteSkill = (catIdx: number, skillIdx: number) => {
    setSkills((prev) => {
      const updated = [...prev];
      updated[catIdx] = {
        ...updated[catIdx],
        skills: updated[catIdx].skills.filter((_, i) => i !== skillIdx),
      };
      return updated;
    });
  };

  const categoriesWithSkills = skills.filter(
    (category) => category.skills && category.skills.length > 0
  );

  return (
    <Card className="p-10 shadow-2xl border-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/60 rounded-3xl">
      <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-extrabold text-blue-900 flex items-center gap-4 tracking-tight">
          <Award className="h-8 w-8 text-blue-500 drop-shadow" />
          <span>Edit Skills</span>
        </CardTitle>
        <button
          className="ml-auto px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
          onClick={handleSave}
          disabled={saving || isSaving}
        >
          {saving || isSaving ? "Saving..." : "Save"}
        </button>
      </CardHeader>
      {categoriesWithSkills.length > 0 ? (
        <div className="space-y-14">
          {categoriesWithSkills.map((category, catIdx) => (
            <div key={category.name}>
              <div className="flex items-center gap-4 mb-5">
                <h3 className="text-xl font-bold  text-blue-900 tracking-wide">
                  {category.name}
                </h3>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-sm font-semibold text-blue-700 shadow-sm">
                  {category.skills.length} skill
                  {category.skills.length > 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  className="ml-2 p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                  onClick={() => handleDeleteCategory(catIdx)}
                  title="Delete Category"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="ml-2 p-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition"
                  onClick={() => handleAddSkill(catIdx)}
                  title="Add Skill"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-6">
                {category.skills.map((skill, skillIdx) => {
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
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <input
                          type="range"
                          min={0}
                          max={maxLevel}
                          value={skill.level}
                          onChange={(e) =>
                            handleLevelChange(
                              catIdx,
                              skillIdx,
                              Number(e.target.value)
                            )
                          }
                          className="w-24 accent-blue-500"
                        />
                        <span
                          className={cn("font-bold text-right", color.text)}
                        >
                          {skill.level}/{maxLevel}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="ml-2 p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                        onClick={() => handleDeleteSkill(catIdx, skillIdx)}
                        title="Delete Skill"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {catIdx !== categoriesWithSkills.length - 1 && (
                <Separator className="my-12 bg-gradient-to-r from-blue-200 via-blue-50 to-transparent" />
              )}
            </div>
          ))}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition"
              onClick={handleAddCategory}
            >
              <Plus className="w-5 h-5 inline-block mr-2" /> Add Category
            </button>
          </div>
        </div>
      ) : (
        <p className="text-blue-600 italic text-center py-12 text-lg">
          No skills listed for this employee.
        </p>
      )}
    </Card>
  );
};

export default EmployeeEditSkills;
