"use client";

import React, { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { updateEmployeePersonalInfo } from "@/app/actions/employee-personal-info";
import { toast } from "react-hot-toast";
import { Employee } from "@/lib/types";

interface EmployeePersonalInfoProps {
  employee: Employee;
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
  const formRef = useRef<HTMLFormElement>(null);

  const [, formAction] = useActionState(
    async (
      _: FormActionState,
      formData: FormData
    ): Promise<FormActionState> => {
      const data: FormValues = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        department: formData.get("department") as string,
        careerExperience: formData.get("careerExperience") as string,
        bio: formData.get("bio") as string,
        country: formData.get("country") as string,
        city: formData.get("city") as string,
        slackProfileImage: formData.get("slackProfileImage") as string,
        slackUrl: formData.get("slackUrl") as string,
        linkedinUrl: formData.get("linkedinUrl") as string,
      };
      try {
        await updateEmployeePersonalInfo(employee.id, data);
        toast.success("Personal info saved!");
        setLocalEmployee({ ...employee, ...data }); // update local state
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
            <Label>Email address</Label>
            <input
              name="email"
              defaultValue={localEmployee.email || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Email"
              type="email"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <input
              name="phone"
              defaultValue={localEmployee.phone || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Phone"
              type="tel"
            />
          </div>
          <div>
            <Label>Department</Label>
            <input
              name="department"
              defaultValue={localEmployee.department || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Department"
            />
          </div>
          <div>
            <Label>Career Experience</Label>
            <input
              name="careerExperience"
              defaultValue={localEmployee.careerExperience || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Career Experience"
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
            <Label>Slack Profile Image URL</Label>
            <input
              name="slackProfileImage"
              defaultValue={localEmployee.slackProfileImage || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Slack Profile Image URL"
            />
          </div>
          <div>
            <Label>Slack URL</Label>
            <input
              name="slackUrl"
              defaultValue={localEmployee.slackUrl || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="Slack URL"
            />
          </div>
          <div>
            <Label>LinkedIn URL</Label>
            <input
              name="linkedinUrl"
              defaultValue={localEmployee.linkedinUrl || ""}
              className="w-full border-b border-blue-100 focus:border-blue-400 outline-none px-2 py-1 bg-transparent text-base"
              placeholder="LinkedIn URL"
            />
          </div>
        </div>
        <Separator className="my-6" />
      </form>
    </Card>
  );
};

export default EmployeeEditPersonalInfo;
