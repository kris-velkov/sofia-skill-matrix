import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Employee } from "@/lib/types";
import React from "react";
import { Pencil } from "lucide-react";

interface EmployeeEditPersonalFormProps {
  employee: Employee;
  isAdmin: boolean;
  editMode: boolean;
  personalState: any;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (formData: FormData) => void;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

interface FieldProps {
  label: string;
  name: keyof Employee;
  value: string | undefined;
  editMode: boolean;
  isAdmin: boolean;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  className?: string;
}

function FormField({
  label,
  name,
  value,
  editMode,
  isAdmin,
  onInputChange,
  type = "text",
  placeholder,
  textarea,
  rows,
  className = "",
}: FieldProps) {
  return (
    <div className={`grid gap-1 ${className}`}>
      <Label htmlFor={name} className="text-gray-500 text-sm">
        {label}
      </Label>
      {editMode && isAdmin ? (
        textarea ? (
          <Textarea
            id={name}
            name={name}
            value={value ?? ""}
            onChange={onInputChange}
            rows={rows}
            placeholder={placeholder}
          />
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            value={value ?? ""}
            onChange={onInputChange}
            placeholder={placeholder}
          />
        )
      ) : (
        <p className="text-gray-800 font-medium">{value ?? "N/A"}</p>
      )}
    </div>
  );
}

export function EmployeeEditPersonalForm({
  employee,
  isAdmin,
  editMode,
  personalState,
  onEdit,
  onCancel,
  onSave,
  onInputChange,
}: EmployeeEditPersonalFormProps) {
  return (
    <form action={onSave}>
      <Card className="p-8 shadow-xl border border-blue-100 bg-white/90 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between p-0 mb-6 border-b border-gray-200 pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Personal Information
          </CardTitle>
          {isAdmin && !editMode ? (
            <Button
              variant="outline"
              size="default"
              onClick={onEdit}
              className="flex items-center gap-2 border-blue-200"
            >
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
                disabled={personalState?.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={personalState?.isPending}
              >
                {personalState?.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-gray-700">
          <input type="hidden" name="id" value={employee.id} />
          <FormField
            label="First Name"
            name="firstName"
            value={employee.firstName}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={employee.lastName}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
          />
          <FormField
            label="Email address"
            name="email"
            value={employee.email}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
            type="email"
          />
          <FormField
            label="Phone"
            name="phone"
            value={employee.phone}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
          />
          <FormField
            label="Department"
            name="department"
            value={employee.department}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
          />
          <FormField
            label="Career Experience"
            name="careerExperience"
            value={employee.careerExperience}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
          />
          <FormField
            label="Badge"
            name="badge"
            value={employee.badge}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
          />
          <FormField
            label="Bio"
            name="bio"
            value={employee.bio}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
            textarea
            rows={3}
            className="col-span-full"
          />
          <FormField
            label="Slack Profile Image URL"
            name="slackProfileImage"
            value={employee.slackProfileImage}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
            placeholder="e.g., https://example.com/my-slack-pic.jpg"
            className="col-span-full"
          />
          <FormField
            label="Slack Profile URL (Optional)"
            name="slackUrl"
            value={employee.slackUrl}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
            placeholder="e.g., https://slack.com/your-profile"
            className="col-span-full"
          />
          <FormField
            label="LinkedIn Profile URL (Optional)"
            name="linkedinUrl"
            value={employee.linkedinUrl}
            editMode={editMode}
            isAdmin={isAdmin}
            onInputChange={onInputChange}
            placeholder="e.g., https://linkedin.com/in/your-profile"
            className="col-span-full"
          />
        </CardContent>
      </Card>
    </form>
  );
}
