import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Employee } from "@/lib/types";
import React from "react";
import { Pencil } from "lucide-react";

interface EmployeeEditAddressFormProps {
  employee: Employee;
  isAdmin: boolean;
  editMode: boolean;
  addressState: unknown;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (formData: FormData) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EmployeeEditAddressForm({
  employee,
  isAdmin,
  editMode,
  addressState,
  onEdit,
  onCancel,
  onSave,
  onInputChange,
}: EmployeeEditAddressFormProps) {
  return (
    <form action={onSave}>
      <Card className="p-6 shadow-md rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Address
          </CardTitle>
          {isAdmin && !editMode ? (
            <Button variant="outline" size="default" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : isAdmin && editMode ? (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onCancel}
                disabled={addressState?.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={addressState?.isPending}
              >
                {addressState?.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <input type="hidden" name="id" value={employee.id} />
          <div className="grid gap-1">
            <Label
              htmlFor="country"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Country
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="country"
                name="country"
                value={employee.country ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.country ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="cityState"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              City/State
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="cityState"
                name="cityState"
                value={employee.cityState ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.cityState ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="postalCode"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Postal Code
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="postalCode"
                name="postalCode"
                value={employee.postalCode ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.postalCode ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="taxId"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              TAX ID
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="taxId"
                name="taxId"
                value={employee.taxId ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.taxId ?? "N/A"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
