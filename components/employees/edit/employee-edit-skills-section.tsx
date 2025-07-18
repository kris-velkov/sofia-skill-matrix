"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  Plus,
  Trash2,
  SaveAll,
  LucideClockFading,
  User2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Skill, SkillCategory, SkillLevel } from "@/types/employees";
import {
  deleteEmployeeSkill,
  updateEmployeeSkills,
  updateEmployeeCategoryName,
  createOrFindCategory,
  deleteCategory,
} from "@/app/actions/employee-skills-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { COMPETENCY_LEVELS } from "@/constants/competency-level";
import EmptyState from "@/components/ui/empty-state";
import { CategoryNameDialog } from "@/components/dialog/category-name-dialog";
import { CategoryDeleteDialog } from "@/components/dialog/category-delete-dialog";

interface EmployeeEditSkillsProps {
  skills: SkillCategory[];
  employeeId: string;
  employeeDepartment: string;
  maxLevel?: number;
}

export const EmployeeEditSkills: React.FC<EmployeeEditSkillsProps> = ({
  skills: initialSkills,
  employeeId,
  employeeDepartment,
  maxLevel = 4,
}) => {
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);

  const [savingCategory, setSavingCategory] = useState<{
    [catIdx: number]: boolean;
  }>({});
  const [isAddingCategory] = useState(false);
  const [categoryNameDialog, setCategoryNameDialog] = useState<{
    open: boolean;
    categoryIndex: number;
    currentName: string;
    isLoading: boolean;
  }>({
    open: false,
    categoryIndex: -1,
    currentName: "",
    isLoading: false,
  });

  const [categoryDeleteDialog, setCategoryDeleteDialog] = useState<{
    open: boolean;
    categoryIndex: number;
    categoryId: string;
    categoryName: string;
    default: boolean;
    isLoading: boolean;
  }>({
    open: false,
    categoryIndex: -1,
    categoryId: "",
    categoryName: "",
    default: false,
    isLoading: false,
  });

  const handleLevelChange = async (
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

  const handleAddCategory = () => {
    const newCategory: SkillCategory = {
      id: "",
      name: "",
      skills: [],
      averageLevel: 0,
      default: false,
    };

    setSkills((prev) => [...prev, newCategory]);
  };

  const handleDeleteCategory = (catIdx: number) => {
    const category = skills[catIdx];

    setCategoryDeleteDialog({
      open: true,
      categoryIndex: catIdx,
      categoryId: category.id,
      categoryName: category.name,
      default: category.default || false,
      isLoading: false,
    });
  };

  const handleConfirmDeleteCategory = async () => {
    const { categoryId, categoryIndex } = categoryDeleteDialog;

    setCategoryDeleteDialog((prev) => ({ ...prev, isLoading: true }));

    try {
      const result = await deleteCategory(categoryId);

      if (result.success) {
        setSkills((prev) => prev.filter((_, idx) => idx !== categoryIndex));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    } finally {
      setCategoryDeleteDialog({
        open: false,
        categoryIndex: -1,
        categoryId: "",
        categoryName: "",
        default: false,
        isLoading: false,
      });
    }
  };

  const handleAddSkill = async (catIdx: number) => {
    const newSkill: Skill = { id: "", name: "", level: 0 };
    setSkills((prev) => {
      const updated = [...prev];
      updated[catIdx] = {
        ...updated[catIdx],
        skills: [...updated[catIdx].skills, newSkill],
      };
      return updated;
    });
  };

  const handleDeleteSkill = async (
    catIdx: number,
    skillPosition: number,
    skillId: string
  ) => {
    try {
      console.log(employeeId, skillId);
      const result = await deleteEmployeeSkill(employeeId, skillId);

      if (result.success) {
        setSkills((prev) => {
          const updated = [...prev];
          updated[catIdx] = {
            ...updated[catIdx],
            skills: updated[catIdx].skills.filter(
              (_, i) => i !== skillPosition
            ),
          };
          return updated;
        });

        toast.success("Skill deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete skill");
      }
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : "Failed to delete skill";
      toast.error(errorMessage);
    }
  };

  const handleSkillNameChange = (
    catIdx: number,
    skillIdx: number,
    newName: string
  ) => {
    setSkills((prev) => {
      const updated = [...prev];
      updated[catIdx] = {
        ...updated[catIdx],
        skills: updated[catIdx].skills.map((s, i) =>
          i === skillIdx ? { ...s, name: newName } : s
        ),
      };
      return updated;
    });
  };

  const handleCategoryNameInput = (catIdx: number, newName: string) => {
    const originalName = initialSkills[catIdx]?.name;
    if (originalName && originalName !== newName && newName.trim() !== "") {
      setCategoryNameDialog({
        open: true,
        categoryIndex: catIdx,
        currentName: originalName,
        isLoading: false,
      });
    } else {
      setSkills((prev) => {
        const updated = [...prev];
        updated[catIdx] = { ...updated[catIdx], name: newName };
        return updated;
      });
    }
  };

  const handleCategoryNameConfirm = async (newName: string) => {
    const { categoryIndex } = categoryNameDialog;

    setCategoryNameDialog((prev) => ({ ...prev, isLoading: true }));

    try {
      const category = skills[categoryIndex];
      const originalName = initialSkills[categoryIndex]?.name;

      if (originalName && category.id) {
        await updateEmployeeCategoryName(category.id, originalName, newName);
      }

      setSkills((prev) => {
        const updated = [...prev];
        updated[categoryIndex] = { ...updated[categoryIndex], name: newName };
        return updated;
      });

      toast.success("Category name updated for all employees!");

      setCategoryNameDialog({
        open: false,
        categoryIndex: -1,
        currentName: "",
        isLoading: false,
      });
    } catch (error) {
      toast.error("Failed to update category name");
      console.error(error);
      setCategoryNameDialog((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSaveCategory = async (catIdx: number) => {
    setSavingCategory((prev) => ({ ...prev, [catIdx]: true }));

    try {
      const category = skills[catIdx];

      if (!category.id) {
        const categoryResult = await createOrFindCategory(
          category.name,
          employeeDepartment
        );

        setSkills((prev) => {
          const updated = [...prev];
          updated[catIdx] = {
            ...updated[catIdx],
            id: categoryResult.id,
          };
          return updated;
        });

        category.id = categoryResult.id;
      } else {
        const originalName = initialSkills[catIdx]?.name;
        if (originalName && originalName !== category.name) {
          await updateEmployeeCategoryName(
            category.id,
            originalName,
            category.name
          );
        }
      }

      await updateEmployeeSkills(employeeId, {
        name: category.name,
        skills: category.skills.map((s) => ({
          id: s.id,
          name: s.name,
          level: s.level,
        })),
      });

      toast.success("Category saved!");
    } catch (e) {
      toast.error("Failed to save category");
      console.error(e);
    } finally {
      setSavingCategory((prev) => ({ ...prev, [catIdx]: false }));
    }
  };

  return (
    <Card className="p-10 shadow-2xl border-0 bg-gradient-to-br from-blue-50/50 via-white to-blue-100/60 rounded-3xl">
      <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-extrabold text-blue-900 flex items-center gap-4 tracking-tight">
          <Award className="h-8 w-8 text-blue-500 drop-shadow" />
          <span>Edit Skills</span>
        </CardTitle>
      </CardHeader>
      {skills && skills.length > 0 ? (
        <div className="space-y-14">
          {skills.map((category, catIdx) => (
            <div key={catIdx}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-5">
                <Input
                  className="w-full sm:w-36 min-w-0 font-bold text-lg bg-transparent border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1"
                  value={category.name}
                  onChange={(e) =>
                    handleCategoryNameInput(catIdx, e.target.value)
                  }
                  placeholder="Category Name"
                />
                <span className="px-3 py-1 rounded-full bg-blue-100 text-xs sm:text-sm font-semibold text-blue-700 shadow-sm">
                  {category.skills.length} skill
                  {category.skills.length > 1 ? "s" : ""}
                </span>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button
                    type="button"
                    className="ml-2 p-3 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                    onClick={() => handleDeleteCategory(catIdx)}
                    title="Delete Category"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                  <Button
                    type="button"
                    className="ml-2 p-3 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition"
                    onClick={() => handleAddSkill(catIdx)}
                    title="Add Skill"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Button
                    className="ml-2 p-2 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition shadow-none"
                    onClick={() => handleSaveCategory(catIdx)}
                    type="button"
                    title="Save changes"
                    variant="ghost"
                    size="icon"
                    disabled={!!savingCategory[catIdx]}
                  >
                    {savingCategory[catIdx] ? (
                      <LucideClockFading className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                      <SaveAll className="w-5 h-5 text-blue-500" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                {category.skills.map((skill, skillIdx) => {
                  const competency = COMPETENCY_LEVELS.find(
                    (item) => item.grade === skill.level || 0
                  );

                  return (
                    <div
                      key={catIdx + "-" + skillIdx}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-2 sm:px-4 py-2 rounded-2xl bg-white/90 hover:shadow-lg transition border border-blue-50"
                    >
                      <Input
                        className="w-full sm:w-36 min-w-0 font-semibold text-normal bg-transparent border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1"
                        value={skill.name}
                        onChange={(e) =>
                          handleSkillNameChange(
                            catIdx,
                            skillIdx,
                            e.target.value
                          )
                        }
                        placeholder="Skill Name"
                        autoFocus={skill.name === "New Skill"}
                      />
                      <div className="flex-1 flex flex-col gap-1 w-full">
                        <div className="relative w-full h-2 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                          <div
                            className={cn(
                              competency?.bgColor,
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
                            "text-xs font-semibold mt-1 ml-1 text-green-300",
                            competency?.progressTextColor
                          )}
                        >
                          {competency?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 min-w-[80px] w-full sm:w-auto">
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
                          className="w-full sm:w-24 accent-gray-400 border border-gray-100"
                        />
                        <span
                          className={cn("font-bold text-right text-gray-800")}
                        >
                          {skill.level}/{maxLevel}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                        onClick={() =>
                          handleDeleteSkill(catIdx, skillIdx, skill.id)
                        }
                        title="Delete Skill"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {catIdx !== skills.length - 1 && (
                <Separator className="my-12 bg-gradient-to-r from-blue-200 via-blue-50 to-transparent" />
              )}
            </div>
          ))}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-bold shadow hover:bg-blue-200 transition flex items-center"
              onClick={handleAddCategory}
              disabled={isAddingCategory}
            >
              {isAddingCategory ? (
                <LucideClockFading className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <Plus className="w-5 h-5 mr-2" />
              )}
              {isAddingCategory ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>
      ) : (
        <EmptyState
          message={"No skills listed for this employee."}
          icon={<User2 className="w-6 h-6 mb-5"></User2>}
        />
      )}

      <CategoryNameDialog
        open={categoryNameDialog.open}
        onOpenChange={(open) =>
          setCategoryNameDialog((prev) => ({ ...prev, open }))
        }
        currentName={categoryNameDialog.currentName}
        onConfirm={handleCategoryNameConfirm}
        isLoading={categoryNameDialog.isLoading}
      />

      <CategoryDeleteDialog
        open={categoryDeleteDialog.open}
        onOpenChange={(open) =>
          setCategoryDeleteDialog((prev) => ({ ...prev, open }))
        }
        categoryName={categoryDeleteDialog.categoryName}
        isDefault={categoryDeleteDialog.default}
        onConfirm={handleConfirmDeleteCategory}
        isLoading={categoryDeleteDialog.isLoading}
      />
    </Card>
  );
};

export default EmployeeEditSkills;
