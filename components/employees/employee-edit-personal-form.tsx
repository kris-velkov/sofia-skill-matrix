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
      <Card className="p-6 shadow-md rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Personal Information
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
        <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <input type="hidden" name="id" value={employee.id} />
          <div className="grid gap-1">
            <Label
              htmlFor="firstName"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              First Name
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="firstName"
                name="firstName"
                value={employee.firstName ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.firstName ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="lastName"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Last Name
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="lastName"
                name="lastName"
                value={employee.lastName ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.lastName ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="email"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Email address
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="email"
                name="email"
                type="email"
                value={employee.email ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.email ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="phone"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Phone
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="phone"
                name="phone"
                value={employee.phone ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.phone ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="department"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Department
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="department"
                name="department"
                value={employee.department ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.department ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="careerExperience"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Career Experience
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="careerExperience"
                name="careerExperience"
                value={employee.careerExperience ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.careerExperience ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label
              htmlFor="badge"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Badge
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="badge"
                name="badge"
                value={employee.badge ?? ""}
                onChange={onInputChange}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.badge ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1 col-span-full">
            <Label
              htmlFor="bio"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Bio
            </Label>
            {editMode && isAdmin ? (
              <Textarea
                id="bio"
                name="bio"
                value={employee.bio ?? ""}
                onChange={onInputChange}
                rows={3}
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.bio ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1 col-span-full">
            <Label
              htmlFor="slackProfileImage"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Slack Profile Image URL
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="slackProfileImage"
                name="slackProfileImage"
                value={employee.slackProfileImage ?? ""}
                onChange={onInputChange}
                placeholder="e.g., https://example.com/my-slack-pic.jpg"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.slackProfileImage ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1 col-span-full">
            <Label
              htmlFor="slackUrl"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              Slack Profile URL (Optional)
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="slackUrl"
                name="slackUrl"
                value={employee.slackUrl ?? ""}
                onChange={onInputChange}
                placeholder="e.g., https://slack.com/your-profile"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.slackUrl ?? "N/A"}
              </p>
            )}
          </div>
          <div className="grid gap-1 col-span-full">
            <Label
              htmlFor="linkedinUrl"
              className="text-gray-500 dark:text-gray-400 text-sm"
            >
              LinkedIn Profile URL (Optional)
            </Label>
            {editMode && isAdmin ? (
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={employee.linkedinUrl ?? ""}
                onChange={onInputChange}
                placeholder="e.g., https://linkedin.com/in/your-profile"
              />
            ) : (
              <p className="text-gray-800 dark:text-gray-200 font-medium">
                {employee.linkedinUrl ?? "N/A"}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
