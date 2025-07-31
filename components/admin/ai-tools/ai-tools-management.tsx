"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { AiToolsTable } from "./ai-tools-table";
import { AiToolFormDialog } from "./ai-tool-form-dialog";
import { Sparkles, Plus } from "lucide-react";
import {
  getAllAiToolsAdmin,
  createAiTool,
  updateAiTool,
  deleteAiTool,
} from "@/app/actions/admin-actions";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/admin-constants";
import {
  withErrorHandling,
  withSuccessHandling,
} from "@/lib/utils/admin/api-helpers";
import { SupabaseAiTool } from "@/types/employees";

export function AiToolsManagement() {
  const [aiTools, setAiTools] = useState<SupabaseAiTool[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<SupabaseAiTool | null>(null);
  const [toolToDelete, setToolToDelete] = useState<SupabaseAiTool | null>(null);

  useEffect(() => {
    loadAiTools();
  }, []);

  const loadAiTools = async () => {
    setLoading(true);
    const toolsData = await withErrorHandling(
      () => getAllAiToolsAdmin(),
      ERROR_MESSAGES.LOAD_AI_TOOLS_FAILED
    );
    if (toolsData) {
      setAiTools(toolsData);
    }
    setLoading(false);
  };

  const handleCreateTool = () => {
    setEditingTool(null);
    setIsFormDialogOpen(true);
  };

  const handleEditTool = (tool: SupabaseAiTool) => {
    setEditingTool(tool);
    setIsFormDialogOpen(true);
  };

  const handleSaveTool = async (data: {
    name: string;
    orderNumber: number;
  }) => {
    await withSuccessHandling(
      async () => {
        if (editingTool) {
          await updateAiTool(editingTool.id, data.name, data.orderNumber);
        } else {
          await createAiTool(data.name, data.orderNumber || undefined);
        }
        loadAiTools();
      },
      editingTool
        ? SUCCESS_MESSAGES.AI_TOOL_UPDATED
        : SUCCESS_MESSAGES.AI_TOOL_CREATED,
      ERROR_MESSAGES.SAVE_AI_TOOL_FAILED
    );
  };

  const handleDeleteTool = (tool: SupabaseAiTool) => {
    setToolToDelete(tool);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteTool = async () => {
    if (!toolToDelete) return;

    await withSuccessHandling(
      async () => {
        await deleteAiTool(toolToDelete.id);
        loadAiTools();
      },
      SUCCESS_MESSAGES.AI_TOOL_DELETED,
      ERROR_MESSAGES.DELETE_AI_TOOL_FAILED
    );

    setIsDeleteDialogOpen(false);
    setToolToDelete(null);
  };

  if (loading) {
    return <PageLoadingSpinner text="Loading AI tools..." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="AI Tools Management"
        description="Manage and organize AI tools with custom ordering"
        icon={<Sparkles className="h-6 w-6 text-blue-600" />}
        gradient="from-blue-200 to-indigo-100"
        action={{
          label: "Add AI Tool",
          onClick: handleCreateTool,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <AiToolsTable
        tools={aiTools}
        onEditTool={handleEditTool}
        onDeleteTool={handleDeleteTool}
      />

      <AiToolFormDialog
        tool={editingTool}
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSave={handleSaveTool}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete AI Tool"
        description={`Are you sure you want to delete "${toolToDelete?.name}"? This action cannot be undone and will affect all employee records using this tool.`}
        confirmText="Delete Tool"
        cancelText="Cancel"
        onConfirm={confirmDeleteTool}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
