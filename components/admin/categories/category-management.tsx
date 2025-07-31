"use client";

import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { CategoryTable } from "./category-table";
import { CategoryFormDialog } from "./category-form-dialog";
import { Layers, Plus } from "lucide-react";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/admin-actions";
import { PageLoadingSpinner } from "@/components/ui/loading-spinner";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/admin-constants";
import {
  withErrorHandling,
  withSuccessHandling,
} from "@/lib/utils/admin/api-helpers";

interface Category extends Record<string, unknown> {
  id: string;
  name: string;
  departments: string[] | null;
  default: boolean | null;
  order_index: number;
  created_at: string | null;
}

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const categoryData = await withErrorHandling(
      () => getAllCategories(),
      ERROR_MESSAGES.LOAD_CATEGORIES_FAILED
    );
    if (categoryData) {
      setCategories(categoryData);
    }
    setLoading(false);
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setIsFormDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setIsFormDialogOpen(true);
  };

  const handleSaveCategory = async (data: {
    name: string;
    departments: string[];
    isDefault: boolean;
    orderIndex: number;
  }) => {
    await withSuccessHandling(
      async () => {
        if (editingCategory) {
          await updateCategory(
            editingCategory.id,
            data.name,
            data.departments,
            data.isDefault,
            data.orderIndex
          );
        } else {
          await createCategory(
            data.name,
            data.departments,
            data.isDefault,
            data.orderIndex || undefined
          );
        }
        loadCategories();
      },
      editingCategory
        ? SUCCESS_MESSAGES.CATEGORY_UPDATED
        : SUCCESS_MESSAGES.CATEGORY_CREATED,
      ERROR_MESSAGES.SAVE_CATEGORY_FAILED
    );
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    await withSuccessHandling(
      async () => {
        await deleteCategory(categoryToDelete.id);
        loadCategories();
      },
      SUCCESS_MESSAGES.CATEGORY_DELETED,
      ERROR_MESSAGES.DELETE_CATEGORY_FAILED
    );

    setIsDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  if (loading) {
    return <PageLoadingSpinner text="Loading categories..." />;
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Category Management"
        description="Organize skill categories with departments and custom ordering"
        icon={<Layers className="h-6 w-6 text-green-600" />}
        gradient="from-green-200 to-emerald-100"
        action={{
          label: "Add Category",
          onClick: handleCreateCategory,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <CategoryTable
        categories={categories}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      <CategoryFormDialog
        category={editingCategory}
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSave={handleSaveCategory}
      />

      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone and may affect existing skills in this category.`}
        confirmText="Delete Category"
        cancelText="Cancel"
        onConfirm={confirmDeleteCategory}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
