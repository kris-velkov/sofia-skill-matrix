"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SkillsTable } from "./skills-table";
import { SkillFormDialog } from "./skill-form-dialog";
import { Zap, Plus } from "lucide-react";
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "@/app/actions/skills-actions";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import {
  withErrorHandling,
  withSuccessHandling,
} from "@/lib/utils/admin/api-helpers";
import { Skill } from "@/types/skills";

export function SkillsManagement() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    setLoading(true);
    const skillData = await withErrorHandling(
      () => getAllSkills(),
      "Failed to load skills"
    );
    if (skillData) {
      setSkills(skillData);
    }
    setLoading(false);
  };

  const handleCreateSkill = () => {
    setEditingSkill(null);
    setIsFormDialogOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setIsFormDialogOpen(true);
  };

  const handleSaveSkill = async (data: {
    name: string;
    category_id: string;
    orderIndex?: number;
  }) => {
    await withSuccessHandling(
      async () => {
        if (editingSkill) {
          await updateSkill(editingSkill.id, {
            name: data.name,
            category_id: data.category_id,
            order_index: data.orderIndex,
          });
        } else {
          await createSkill({
            name: data.name,
            category_id: data.category_id,
            order_index: data.orderIndex,
          });
        }
        loadSkills();
      },
      editingSkill
        ? "Skill updated successfully"
        : "Skill created successfully",
      "Failed to save skill"
    );
  };

  const handleDeleteSkill = (skill: Skill) => {
    setSkillToDelete(skill);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSkill = async () => {
    if (!skillToDelete) return;

    await withSuccessHandling(
      async () => {
        await deleteSkill(skillToDelete.id);
        loadSkills();
      },
      "Skill deleted successfully",
      "Failed to delete skill"
    );

    setIsDeleteDialogOpen(false);
    setSkillToDelete(null);
  };

  if (loading) {
    return <PageLoadingSpinner text="Loading skills..." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Skills Management"
        description="Manage skills and technologies organized by categories"
        icon={<Zap className="h-6 w-6 text-purple-600" />}
        gradient="from-purple-200 to-pink-100"
        action={{
          label: "Add Skill",
          onClick: handleCreateSkill,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <SkillsTable
        skills={skills}
        onEditSkill={handleEditSkill}
        onDeleteSkill={handleDeleteSkill}
      />

      <SkillFormDialog
        skill={editingSkill}
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSave={handleSaveSkill}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Skill"
        description={`Are you sure you want to delete "${skillToDelete?.name}"? This action cannot be undone and will fail if the skill is assigned to employees.`}
        confirmText="Delete Skill"
        cancelText="Cancel"
        onConfirm={confirmDeleteSkill}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
