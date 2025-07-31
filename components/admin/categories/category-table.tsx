"use client";

import { DataTable } from "@/components/ui/data-table";
import { ActionButtons } from "@/components/ui/action-buttons";
import { Badge } from "@/components/ui/badge";
import { Layers, GripVertical, Star, Settings } from "lucide-react";
import { DepartmentLabels, Department } from "@/types/employees";

interface Category extends Record<string, unknown> {
  id: string;
  name: string;
  departments: string[] | null;
  default: boolean | null;
  order_index: number;
  created_at: string | null;
}

interface CategoryTableProps {
  categories: Category[];
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}

export function CategoryTable({
  categories,
  onEditCategory,
  onDeleteCategory,
}: CategoryTableProps) {
  const getDepartmentLabel = (value: string) => {
    return DepartmentLabels[value as Department] || value;
  };

  const columns = [
    {
      key: "name",
      header: "Category Name",
      cell: (category: Category) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-400">
            <GripVertical className="h-4 w-4" />
            <div className="p-1.5 bg-green-400 rounded-md">
              <Settings className="h-4 w-4 text-white" />
            </div>
          </div>
          <span className="font-medium text-gray-900">{category.name}</span>
        </div>
      ),
    },
    {
      key: "departments",
      header: "Departments",
      cell: (category: Category) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {(category.departments || []).slice(0, 3).map((dept) => (
            <Badge key={dept} className="text-xs bg-sky-200">
              {getDepartmentLabel(dept)}
            </Badge>
          ))}
          {(category.departments || []).length > 3 && (
            <Badge className="text-xs bg-blue-300">
              +{(category.departments || []).length - 3} more
            </Badge>
          )}
          {(!category.departments || category.departments.length === 0) && (
            <span className="text-gray-400 text-sm">No departments</span>
          )}
        </div>
      ),
      className: "hidden sm:table-cell",
    },
    {
      key: "order",
      header: "Order",
      cell: (category: Category) => (
        <Badge className="bg-gray-200 border-gray-200">
          {category.order_index}
        </Badge>
      ),
      className: "hidden md:table-cell",
    },
    {
      key: "status",
      header: "Status",
      cell: (category: Category) => (
        <div className="flex gap-1">
          {category.default && (
            <Badge className="bg-orange-100 text-amber-800 border-amber-400">
              <Star className="h-3 w-3 mr-1" />
              Default
            </Badge>
          )}
        </div>
      ),
      className: "hidden lg:table-cell",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (category: Category) => (
        <ActionButtons
          onEdit={() => onEditCategory(category)}
          onDelete={() => onDeleteCategory(category)}
          variant="inline"
        />
      ),
      className: "text-right",
    },
  ];

  return (
    <DataTable<Category>
      data={categories}
      columns={columns}
      searchPlaceholder="Search categories..."
      searchKeys={["name"]}
      emptyState={{
        icon: <Layers className="h-12 w-12" />,
        title: "No categories found",
        description: "Create your first category to get started",
      }}
    />
  );
}
