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
import { Role } from "@/types/roles";
import { DepartmentLabels } from "@/types/employees";

interface RoleFormDialogProps {
  role?: Role | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: {
    name: string;
    departament: string;
    roleId: string;
    orderIndex?: number;
  }) => Promise<void>;
}

export function RoleFormDialog({
  role,
  open,
  onOpenChange,
  onSave,
}: RoleFormDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    departament: "",
    roleId: "",
    orderIndex: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = !!role;

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        departament: role.departament,
        roleId: role.roleId,
        orderIndex: role.order_index || 0,
      });
    } else {
      setFormData({
        name: "",
        departament: "",
        roleId: "",
        orderIndex: 0,
      });
    }
  }, [role, open]);

  const handleSave = async () => {
    if (
      !formData.name.trim() ||
      !formData.departament ||
      !formData.roleId.trim()
    ) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      departament: "",
      roleId: "",
      orderIndex: 0,
    });
    onOpenChange(false);
  };

  const handleRoleIdChange = (roleId: string) => {
    const sanitizedRoleId = roleId.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    setFormData((prev) => ({ ...prev, roleId: sanitizedRoleId }));
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({ ...prev, name }));

    if (
      !formData.roleId ||
      formData.roleId ===
        formData.name.toLowerCase().replace(/[^a-z0-9-_]/g, "-")
    ) {
      const sanitizedRoleId = name.toLowerCase().replace(/[^a-z0-9-_]/g, "-");
      setFormData((prev) => ({ ...prev, roleId: sanitizedRoleId }));
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Role" : "Create New Role"}
      icon={
        isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />
      }
      footer={
        <FormActions
          onCancel={handleCancel}
          onSubmit={handleSave}
          submitLabel={isEditing ? "Save Changes" : "Create Role"}
          isLoading={isLoading}
          submitDisabled={
            !formData.name.trim() ||
            !formData.departament ||
            !formData.roleId.trim()
          }
        />
      }
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Role Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., Senior Developer, QA Engineer"
            className="mt-1 bg-white"
          />
          <p className="text-xs text-gray-500 mt-1">
            Display name for the role
          </p>
        </div>

        <div>
          <Label
            htmlFor="departament"
            className="text-sm font-medium text-gray-700"
          >
            Department
          </Label>
          <Select
            value={formData.departament}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, departament: value }))
            }
          >
            <SelectTrigger className="mt-1 bg-white">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DepartmentLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            Department this role belongs to
          </p>
        </div>

        <div>
          <Label htmlFor="roleId" className="text-sm font-medium text-gray-700">
            Role ID
          </Label>
          <Input
            id="roleId"
            value={formData.roleId}
            onChange={(e) => handleRoleIdChange(e.target.value)}
            placeholder="e.g., senior-developer, qa-engineer"
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
            Lower numbers appear first within department
          </p>
        </div>
      </div>
    </FormDialog>
  );
}
