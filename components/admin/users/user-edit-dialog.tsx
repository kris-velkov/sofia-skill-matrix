"use client";

import { useState } from "react";
import * as React from "react";
import { FormDialog } from "@/components/ui/form-dialog";
import { FormActions } from "@/components/ui/form-actions";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { ROLE_CONFIGS } from "@/constants/role-configs";
import { AppUser } from "@/lib/utils/admin/user-helpers";
import { ProgramSelect } from "@/components/ui/program-select";

interface UserEditDialogProps {
  user: AppUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: AppUser) => Promise<void>;
}

export function UserEditDialog({
  user,
  open,
  onOpenChange,
  onSave,
}: UserEditDialogProps) {
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      setEditingUser({ ...user });
    }
  }, [user]);

  const handleSave = async () => {
    if (!editingUser) return;

    setIsLoading(true);
    try {
      await onSave(editingUser);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingUser(user ? { ...user } : null);
    onOpenChange(false);
  };

  if (!editingUser) return null;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit User Permissions"
      icon={<Edit className="h-5 w-5" />}
      footer={
        <FormActions
          onCancel={handleCancel}
          onSubmit={handleSave}
          submitLabel="Save Changes"
          isLoading={isLoading}
        />
      }
    >
      <div className="space-y-6">
        <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-900 truncate">
            {editingUser.email}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium text-gray-700">
            Role
          </Label>
          <Select
            value={editingUser.role}
            onValueChange={(value) =>
              setEditingUser({ ...editingUser, role: value })
            }
          >
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {ROLE_CONFIGS.map((role) => {
                const IconComponent = role.icon;
                return (
                  <SelectItem key={role.value} value={role.value}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4" />
                      {role.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="program"
            className="text-sm font-medium text-gray-700"
          >
            Program Access
          </Label>
          <ProgramSelect
            value={editingUser.program}
            onValueChange={(value) =>
              setEditingUser({ ...editingUser, program: value })
            }
            placeholder="Select program access"
          />
        </div>
      </div>
    </FormDialog>
  );
}
