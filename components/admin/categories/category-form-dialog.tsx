"use client";

import { useState, useEffect } from "react";
import { FormDialog } from "@/components/ui/form-dialog";
import { FormActions } from "@/components/ui/form-actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Star } from "lucide-react";
import { ROLES } from "@/constants/employeeDefaultsSkills";

interface Category {
  id: string;
  name: string;
  departments: string[] | null;
  default: boolean | null;
  order_index: number;
  created_at: string | null;
}

interface CategoryFormDialogProps {
  category?: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    name: string;
    departments: string[];
    isDefault: boolean;
    orderIndex: number;
  }) => Promise<void>;
}

export function CategoryFormDialog({
  category,
  open,
  onOpenChange,
  onSave,
}: CategoryFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    departments: [] as string[],
    isDefault: false,
    orderIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        departments: category.departments || [],
        isDefault: category.default || false,
        orderIndex: category.order_index,
      });
    } else {
      setFormData({
        name: "",
        departments: [],
        isDefault: false,
        orderIndex: 0,
      });
    }
  }, [category, open]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save category:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      departments: [],
      isDefault: false,
      orderIndex: 0,
    });
    onOpenChange(false);
  };

  const handleDepartmentChange = (department: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        departments: [...prev.departments, department],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        departments: prev.departments.filter((d) => d !== department),
      }));
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Category" : "Create New Category"}
      icon={
        isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />
      }
      maxWidth="lg"
      footer={
        <FormActions
          onCancel={handleCancel}
          onSubmit={handleSave}
          submitLabel={isEditing ? "Save Changes" : "Create Category"}
          isLoading={isLoading}
          submitDisabled={!formData.name.trim()}
        />
      }
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Category Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="e.g., Frontend Development, Data Analysis"
            className="mt-1 bg-white"
          />
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

        <div>
          <Label className="text-sm font-medium text-gray-700">
            Departments
          </Label>
          <div className="grid grid-cols-2 gap-3 mt-2 max-h-48 overflow-y-auto p-4 border rounded-lg bg-gray-50">
            {ROLES.map((role) => (
              <div
                key={role.departament}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={role.departament}
                  checked={formData.departments.includes(role.departament)}
                  onCheckedChange={(checked) =>
                    handleDepartmentChange(role.departament, checked as boolean)
                  }
                />
                <Label
                  htmlFor={role.departament}
                  className="text-sm font-normal cursor-pointer"
                >
                  {role.name}
                </Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Selected: {formData.departments.length} departments
          </p>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <Checkbox
            id="isDefault"
            checked={formData.isDefault}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({
                ...prev,
                isDefault: checked as boolean,
              }))
            }
          />
          <Label
            htmlFor="isDefault"
            className="flex items-center gap-2 cursor-pointer text-sm"
          >
            <Star className="h-4 w-4 text-amber-600" />
            Set as default category
          </Label>
        </div>
      </div>
    </FormDialog>
  );
}
