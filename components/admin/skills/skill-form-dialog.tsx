"use client";

import { useState, useEffect } from "react";
import { FormDialog } from "@/components/ui/form-dialog";
import { FormActions } from "@/components/ui/form-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit } from "lucide-react";
import { Skill } from "@/types/skills";
import { getAllCategories } from "@/app/actions/admin-actions";

interface SkillFormDialogProps {
  skill?: Skill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    name: string;
    category_id: string;
    orderIndex?: number;
  }) => Promise<void>;
}

export function SkillFormDialog({
  skill,
  open,
  onOpenChange,
  onSave,
}: SkillFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    orderIndex: 0,
  });
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const isEditing = !!skill;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category_id: skill.category_id,
        orderIndex: skill.order_index || 0,
      });
    } else {
      setFormData({
        name: "",
        category_id: "",
        orderIndex: 0,
      });
    }
  }, [skill, open]);

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.category_id) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save skill:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      category_id: "",
      orderIndex: 0,
    });
    onOpenChange(false);
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Skill" : "Create New Skill"}
      icon={
        isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />
      }
      footer={
        <FormActions
          onCancel={handleCancel}
          onSubmit={handleSave}
          submitLabel={isEditing ? "Save Changes" : "Create Skill"}
          isLoading={isLoading}
          submitDisabled={!formData.name.trim() || !formData.category_id}
        />
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Skill Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., React, TypeScript, Node.js"
            className="mt-1 bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Name of the skill or technology
          </p>
        </div>

        <div>
          <Label
            htmlFor="category_id"
            className="text-sm font-medium text-gray-700"
          >
            Category
          </Label>
          <Select
            value={formData.category_id}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, category_id: value }))
            }
            disabled={categoriesLoading}
          >
            <SelectTrigger className="mt-1 bg-white">
              <SelectValue
                placeholder={
                  categoriesLoading
                    ? "Loading categories..."
                    : "Select category"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Category this skill belongs to
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
            Lower numbers appear first within category
          </p>
        </div>
      </div>
    </FormDialog>
  );
}
