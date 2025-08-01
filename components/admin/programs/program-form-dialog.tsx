"use client";

import { useState, useEffect } from "react";
import { FormDialog } from "@/components/ui/form-dialog";
import { FormActions } from "@/components/ui/form-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Edit } from "lucide-react";
import { Program } from "@/types/programs";

interface ProgramFormDialogProps {
  program?: Program | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    label: string;
    value: string;
    orderIndex?: number;
  }) => Promise<void>;
}

export function ProgramFormDialog({
  program,
  open,
  onOpenChange,
  onSave,
}: ProgramFormDialogProps) {
  const [formData, setFormData] = useState({
    label: "",
    value: "",
    orderIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!program;

  useEffect(() => {
    if (program) {
      setFormData({
        label: program.label,
        value: program.value,
        orderIndex: program.order_index || 0,
      });
    } else {
      setFormData({
        label: "",
        value: "",
        orderIndex: 0,
      });
    }
  }, [program, open]);

  const handleSave = async () => {
    if (!formData.label.trim() || !formData.value.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save program:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      label: "",
      value: "",
      orderIndex: 0,
    });
    onOpenChange(false);
  };

  const handleValueChange = (value: string) => {
    const sanitizedValue = value.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    setFormData((prev) => ({ ...prev, value: sanitizedValue }));
  };

  const handleLabelChange = (label: string) => {
    setFormData((prev) => ({ ...prev, label }));

    if (
      !formData.value ||
      formData.value ===
        formData.label.toLowerCase().replace(/[^a-z0-9-_]/g, "-")
    ) {
      const sanitizedValue = label.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
      setFormData((prev) => ({ ...prev, value: sanitizedValue }));
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Program" : "Create New Program"}
      icon={
        isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />
      }
      footer={
        <FormActions
          onCancel={handleCancel}
          onSubmit={handleSave}
          submitLabel={isEditing ? "Save Changes" : "Create Program"}
          isLoading={isLoading}
          submitDisabled={!formData.label.trim() || !formData.value.trim()}
        />
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="label" className="text-sm font-medium text-gray-700">
            Program Label
          </Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="e.g., Frontend Development, Data Science"
            className="mt-1 bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Display name for the program
          </p>
        </div>

        <div>
          <Label htmlFor="value" className="text-sm font-medium text-gray-700">
            Program Value
          </Label>
          <Input
            id="value"
            value={formData.value}
            onChange={(e) => handleValueChange(e.target.value)}
            placeholder="e.g., frontend-dev, data-science"
            className="mt-1 bg-white font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Unique identifier (lowercase, alphanumeric, hyphens, underscores
            only)
          </p>
        </div>

        <div>
          <Label
            htmlFor="orderIndex"
            className="text-sm font-medium text-gray-700"
          >
            Order Index
          </Label>
          <Input
            id="orderIndex"
            type="number"
            value={formData.orderIndex}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                orderIndex: parseInt(e.target.value) || 0,
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
