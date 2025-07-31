"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { UserStats } from "./user-stats";
import { UserTable } from "./user-table";
import { UserEditDialog } from "./user-edit-dialog";
import { Users } from "lucide-react";
import {
  getAllUsers,
  updateUserRole,
  updateUserProgram,
  deleteUser,
} from "@/app/actions/admin-actions";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/admin-constants";
import {
  withErrorHandling,
  withSuccessHandling,
} from "@/lib/utils/admin/api-helpers";
import { AppUser } from "@/lib/utils/admin/user-helpers";

export function UserManagement() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const userData = await withErrorHandling(
      () => getAllUsers(),
      ERROR_MESSAGES.LOAD_USERS_FAILED
    );
    if (userData) {
      setUsers(userData);
    }
    setLoading(false);
  };

  const handleEditUser = (user: AppUser) => {
    setEditingUser(user);
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = async (updatedUser: AppUser) => {
    await withSuccessHandling(
      async () => {
        await Promise.all([
          updateUserRole(updatedUser.id, updatedUser.role),
          updateUserProgram(updatedUser.id, updatedUser.program),
        ]);

        setUsers(
          users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
      },
      SUCCESS_MESSAGES.USER_UPDATED,
      ERROR_MESSAGES.SAVE_USER_FAILED
    );
  };

  const handleDeleteUser = (user: AppUser) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    await withSuccessHandling(
      async () => {
        await deleteUser(userToDelete.id);
        setUsers(users.filter((user) => user.id !== userToDelete.id));
      },
      SUCCESS_MESSAGES.USER_DELETED,
      ERROR_MESSAGES.DELETE_USER_FAILED
    );

    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  if (loading) {
    return <PageLoadingSpinner text="Loading users..." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="User Management"
        description="Manage user roles, permissions, and access levels"
        icon={<Users className="h-6 w-6 text-blue-600" />}
        gradient="from-blue-200 to-sky-300"
      />

      <UserStats users={users} />

      <UserTable
        users={users}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      <UserEditDialog
        user={editingUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveUser}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete User"
        description={`Are you sure you want to delete (${userToDelete?.email})? This action cannot be undone and will remove all associated data.`}
        confirmText="Delete User"
        cancelText="Cancel"
        onConfirm={confirmDeleteUser}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
