"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { RolesTable } from "./roles-table";
import { RoleFormDialog } from "./role-form-dialog";
import { UserCheck, Plus } from "lucide-react";
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
} from "@/app/actions/roles-actions";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import {
  withErrorHandling,
  withSuccessHandling,
} from "@/lib/utils/admin/api-helpers";
import { Role } from "@/types/roles";

export function RolesManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    const roleData = await withErrorHandling(
      () => getAllRoles(),
      "Failed to load roles"
    );
    if (roleData) {
      setRoles(roleData);
    }
    setLoading(false);
  };

  const handleCreateRole = () => {
    setEditingRole(null);
    setIsFormDialogOpen(true);
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsFormDialogOpen(true);
  };

  const handleSaveRole = async (data: {
    name: string;
    departament: string;
    roleId: string;
  }) => {
    await withSuccessHandling(
      async () => {
        if (editingRole) {
          await updateRole(editingRole.id, data);
        } else {
          await createRole(data);
        }
        loadRoles();
      },
      editingRole ? "Role updated successfully" : "Role created successfully",
      "Failed to save role"
    );
  };

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (!roleToDelete) return;

    await withSuccessHandling(
      async () => {
        await deleteRole(roleToDelete.id);
        loadRoles();
      },
      "Role deleted successfully",
      "Failed to delete role"
    );

    setIsDeleteDialogOpen(false);
    setRoleToDelete(null);
  };

  if (loading) {
    return <PageLoadingSpinner text="Loading roles..." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Roles Management"
        description="Manage employee roles organized by departments"
        icon={<UserCheck className="h-6 w-6 text-indigo-600" />}
        gradient="from-indigo-200 to-purple-100"
        action={{
          label: "Add Role",
          onClick: handleCreateRole,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <RolesTable
        roles={roles}
        onEditRole={handleEditRole}
        onDeleteRole={handleDeleteRole}
      />

      <RoleFormDialog
        role={editingRole}
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSave={handleSaveRole}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Role"
        description={`Are you sure you want to delete "${roleToDelete?.name}"? This action cannot be undone and will fail if the role is assigned to employees.`}
        confirmText="Delete Role"
        cancelText="Cancel"
        onConfirm={confirmDeleteRole}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
