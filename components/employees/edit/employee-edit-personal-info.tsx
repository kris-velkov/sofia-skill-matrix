"use client";

import React, { useRef, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateEmployeePersonalInfo } from "@/app/actions/employee-personal-info";
import { toast } from "react-hot-toast";
import { Employee } from "@/types/employees";
import { PROGRAMS } from "@/constants/programs";

interface EmployeePersonalInfoProps {
  employee: Omit<Employee, "skills">;
}

type FormValues = Omit<EmployeePersonalInfoProps["employee"], "id">;
type FormActionState = { success?: boolean; error?: boolean };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="ml-auto px-6 py-2 rounded-lg bg-blue-600 text-white font-bold shadow hover:bg-blue-700 transition disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

export const EmployeeEditPersonalInfo: React.FC<EmployeePersonalInfoProps> = ({
  employee,
}) => {
  const [localEmployee, setLocalEmployee] = useState(employee);
  const [selectedProgram, setSelectedProgram] = useState(
    employee.program || ""
  );
  const formRef = useRef<HTMLFormElement>(null);

  const [, formAction] = useActionState(
    async (
      _: FormActionState,
      formData: FormData
    ): Promise<FormActionState> => {
      let imageUrl = formData.get("profileImage") as string;
      if (imageUrl && !imageUrl.includes("ca.slack-edge.com")) {
        imageUrl = "";
        toast.error("Not valid image url! Please use Slack image url.");
      }

      const data: FormValues = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        floatId: formData.get("floatId") as string,
        careerExperience: formData.get("careerExperience") as string,
        startDate: formData.get("startDate") as string,
        program: formData.get("program") as string,
        role: formData.get("careerBadge") as string,
        bio: formData.get("bio") as string,
        country: formData.get("country") as string,
        city: formData.get("city") as string,
        profileImage: imageUrl,
        slackUrl: formData.get("slackUrl") as string,
        linkedinUrl: formData.get("linkedinUrl") as string,
      };
      try {
        await updateEmployeePersonalInfo(employee.id, data);
        toast.success("Personal info saved!");
        setLocalEmployee({ ...employee, ...data });
        setTimeout(() => {
          formRef.current?.reset();
        }, 0);
        return { success: true };
      } catch {
        toast.error("Failed to update User Profile info");
        return { error: true };
      }
    },
    {} as FormActionState
  );

  return (
    <Card className="p-8 shadow-lg border-0 bg-white/90">
      <form action={formAction} ref={formRef}>
        <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Personal Information
          </CardTitle>
          <SubmitButton />
        </CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-gray-700">
          <div>
            <Label>First Name</Label>
            <input
              name="firstName"
              defaultValue={localEmployee.firstName || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-lg font-semibold"
              placeholder="First Name"
            />
          </div>
          <div>
            <Label>Last Name</Label>
            <input
              name="lastName"
              defaultValue={localEmployee.lastName || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-lg font-semibold"
              placeholder="Last Name"
            />
          </div>
          <div>
            <Label>Program</Label>
            <Select
              name="program"
              value={selectedProgram}
              onValueChange={(value) => {
                setSelectedProgram(value);
                const hiddenInput = document.querySelector(
                  'input[name="program"]'
                ) as HTMLInputElement;
                if (hiddenInput) {
                  hiddenInput.value = value;
                }
              }}
            >
              <SelectTrigger className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base border-0 border-b-2 rounded-none">
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {PROGRAMS.map((program) => (
                  <SelectItem key={program.value} value={program.value}>
                    {program.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="program" value={selectedProgram} />
          </div>
          <div className="text-gray-400 cursor-not-allowed">
            <Label>Department</Label>
            <input
              name="department"
              defaultValue={localEmployee.department ?? ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base cursor-not-allowed"
              placeholder="Department"
              disabled
            />
          </div>
          <div>
            <Label>Role</Label>
            <input
              name="careerBadge"
              defaultValue={localEmployee.role || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Career role"
            />
          </div>
          <div>
            <Label>Float Id</Label>
            <input
              name="floatId"
              defaultValue={localEmployee.floatId || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Float id"
            />
          </div>
          <div>
            <Label>Hired On</Label>
            <input
              type="date"
              name="startDate"
              defaultValue={(localEmployee.startDate as string) || ""}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Start Date"
            />
          </div>
          <div>
            <Label>Experience Since</Label>
            <input
              type="date"
              name="careerExperience"
              defaultValue={(localEmployee.careerExperience as string) || ""}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Start Date"
            />
          </div>

          <div>
            <Label>Country</Label>
            <input
              name="country"
              defaultValue={localEmployee.country || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Country"
            />
          </div>
          <div>
            <Label>City</Label>
            <input
              name="city"
              defaultValue={localEmployee.city || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="City"
            />
          </div>
          <div className="md:col-span-2">
            <Label> Slack Image URL</Label>
            <input
              name="profileImage"
              defaultValue={localEmployee.profileImage || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="https://ca.slack-edge.com/"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Slack URL</Label>
            <input
              name="slackUrl"
              defaultValue={localEmployee.slackUrl || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Slack URL"
            />
          </div>
          <div className="md:col-span-2">
            <Label>LinkedIn URL</Label>
            <input
              name="linkedinUrl"
              defaultValue={localEmployee.linkedinUrl || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="LinkedIn URL"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Bio</Label>
            <textarea
              name="bio"
              defaultValue={localEmployee.bio || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base min-h-[60px]"
              placeholder="Bio"
            />
          </div>
        </div>
        <Separator className="my-6" />
      </form>
    </Card>
  );
};

export default EmployeeEditPersonalInfo;
