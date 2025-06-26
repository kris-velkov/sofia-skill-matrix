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
    addressState: { isPending?: boolean } | unknown;
    onEdit: () => void;
    onCancel: () => void;
    onSave: (formData: FormData) => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface AddressFieldProps {
    label: string;
    name: keyof Employee;
    value: string | null | undefined;
    editMode: boolean;
    isAdmin: boolean;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputType?: string;
}

function AddressField({
    label,
    name,
    value,
    editMode,
    isAdmin,
    onInputChange,
    inputType = "text",
}: AddressFieldProps) {
    return (
        <div className="grid gap-1">
            <Label htmlFor={name} className="text-gray-500 text-sm">
                {label}
            </Label>
            {editMode && isAdmin ? (
                <Input
                    id={name}
                    name={name}
                    value={value ?? ""}
                    onChange={onInputChange}
                    type={inputType}
                />
            ) : (
                <p className="text-gray-800 font-medium">
                    {value ?? "N/A"}
                </p>
            )}
        </div>
    );
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
    const isPending = (addressState as any)?.isPending;

    return (
        <form action={onSave}>
            <Card className="p-6 shadow-md rounded-xl">
                <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-800">
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
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={isPending}
                            >
                                {isPending ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    ) : null}
                </CardHeader>
                <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <input type="hidden" name="id" value={employee.id} />
                    <AddressField
                        label="Country"
                        name="country"
                        value={employee.country}
                        editMode={editMode}
                        isAdmin={isAdmin}
                        onInputChange={onInputChange}
                    />
                    <AddressField
                        label="City/State"
                        name="cityState"
                        value={employee.cityState}
                        editMode={editMode}
                        isAdmin={isAdmin}
                        onInputChange={onInputChange}
                    />
                    <AddressField
                        label="Postal Code"
                        name="postalCode"
                        value={employee.postalCode}
                        editMode={editMode}
                        isAdmin={isAdmin}
                        onInputChange={onInputChange}
                    />
                    <AddressField
                        label="TAX ID"
                        name="taxId"
                        value={employee.taxId}
                        editMode={editMode}
                        isAdmin={isAdmin}
                        onInputChange={onInputChange}
                    />
                </CardContent>
            </Card>
        </form>
    );
}
