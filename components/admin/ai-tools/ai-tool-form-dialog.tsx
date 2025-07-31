"use client";

import { useState, useEffect } from "react";
import { FormDialog } from "@/components/ui/form-dialog";
import { FormActions } from "@/components/ui/form-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Edit } from "lucide-react";

interface AiTool {
  id: string;
  name: string;
  order_number: number;
  created_at: string | null;
}

interface AiToolFormDialogProps {
  tool?: AiTool | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; orderNumber: number }) => Promise<void>;
}

export function AiToolFormDialog({
  tool,
  open,
  onOpenChange,
  onSave,
}: AiToolFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    orderNumber: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!tool;

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name,
        orderNumber: tool.order_number,
      });
    } else {
      setFormData({
        name: "",
        orderNumber: 0,
      });
    }
  }, [tool, open]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save AI tool:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      orderNumber: 0,
    });
    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit AI Tool" : "Create New AI Tool"}
      icon={
        isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />
      }
      footer={
        <FormActions
          onCancel={handleCancel}
          onSubmit={handleSave}
          submitLabel={isEditing ? "Save Changes" : "Create Tool"}
          isLoading={isLoading}
          submitDisabled={!formData.name.trim()}
        />
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Tool Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., ChatGPT, Claude, Copilot"
            className="mt-1 bg-white"
          />
        </div>

        <div>
          <Label
            htmlFor="orderNumber"
            className="text-sm font-medium text-gray-700"
          >
            Order Number
          </Label>
          <Input
            id="orderNumber"
            type="number"
            value={formData.orderNumber}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                orderNumber: parseInt(e.target.value) || 0,
              }))
            }
            placeholder="Display order (optional)"
            className="mt-1 bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Lower numbers appear first
          </p>
        </div>
      </div>
    </FormDialog>
  );
}
