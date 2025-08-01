"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ProgramsTable } from "./programs-table";
import { ProgramFormDialog } from "./program-form-dialog";
import { Briefcase, Plus } from "lucide-react";
import {
  getAllPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
} from "@/app/actions/programs-actions";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import {
  withErrorHandling,
  withSuccessHandling,
} from "@/lib/utils/admin/api-helpers";
import { Program } from "@/types/programs";

export function ProgramsManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    setLoading(true);
    const programData = await withErrorHandling(
      () => getAllPrograms(),
      "Failed to load programs"
    );
    if (programData) {
      setPrograms(programData);
    }
    setLoading(false);
  };

  const handleCreateProgram = () => {
    setEditingProgram(null);
    setIsFormDialogOpen(true);
  };

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program);
    setIsFormDialogOpen(true);
  };

  const handleSaveProgram = async (data: { label: string; value: string }) => {
    await withSuccessHandling(
      async () => {
        if (editingProgram) {
          await updateProgram(editingProgram.id, data);
        } else {
          await createProgram(data);
        }
        loadPrograms();
      },
      editingProgram
        ? "Program updated successfully"
        : "Program created successfully",
      "Failed to save program"
    );
  };

  const handleDeleteProgram = (program: Program) => {
    setProgramToDelete(program);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProgram = async () => {
    if (!programToDelete) return;

    await withSuccessHandling(
      async () => {
        await deleteProgram(programToDelete.id);
        loadPrograms();
      },
      "Program deleted successfully",
      "Failed to delete program"
    );

    setIsDeleteDialogOpen(false);
    setProgramToDelete(null);
  };

  if (loading) {
    return <PageLoadingSpinner text="Loading programs..." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Programs Management"
        description="Manage and organize programs with custom labels and values"
        icon={<Briefcase className="h-6 w-6 text-orange-600" />}
        gradient="from-orange-200 to-amber-100"
        action={{
          label: "Add Program",
          onClick: handleCreateProgram,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <ProgramsTable
        programs={programs}
        onEditProgram={handleEditProgram}
        onDeleteProgram={handleDeleteProgram}
      />

      <ProgramFormDialog
        program={editingProgram}
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSave={handleSaveProgram}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Program"
        description={`Are you sure you want to delete "${programToDelete?.label}"? This action cannot be undone and will fail if the program is assigned to employees.`}
        confirmText="Delete Program"
        cancelText="Cancel"
        onConfirm={confirmDeleteProgram}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
