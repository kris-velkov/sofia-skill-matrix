"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Slack } from "lucide-react";

type Employee = {
  firstName: string;
  lastName: string;
  email?: string;
  department?: string;
  cityState?: string;
  country?: string;
  badge?: string;
  slackProfileImage?: string;
  linkedinUrl?: string;
  slackUrl?: string;
};

interface EmployeeHeaderInfoProps {
  employee: Employee;
}

export const EmployeeHeaderInfo: React.FC<EmployeeHeaderInfoProps> = ({
  employee,
}) => {
  return (
    <Card className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl border-0 bg-gradient-to-tr from-blue-100/60 to-white">
      <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-blue-400 shadow-lg">
        <AvatarImage
          src={
            employee.slackProfileImage ||
            "/placeholder.svg?height=128&width=128&query=user+avatar"
          }
          alt={`${employee.firstName} profile`}
        />
      </Avatar>
      <div className="flex-1 text-center md:text-left space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {employee.firstName} {employee.lastName}
        </h1>
        <p className="text-lg text-gray-600">
          {employee.department}
          {employee.cityState && ` • ${employee.cityState}`}
          {employee.country && `, ${employee.country}`}
        </p>
        {employee.badge && (
          <Badge className="mt-2 px-4 py-1 text-base bg-blue-200 text-blue-800 font-semibold shadow">
            {employee.badge}
          </Badge>
        )}
      </div>
      <div className="flex gap-4 mt-6 md:mt-0">
        {employee.linkedinUrl && (
          <a
            href={employee.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition-colors hover:bg-blue-200 hover:text-blue-900 shadow"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-6 w-6" />
          </a>
        )}
        {employee.slackUrl && (
          <a
            href={employee.slackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700 transition-colors hover:bg-blue-200 hover:text-blue-900 shadow"
            aria-label="Slack Profile"
          >
            <Slack className="h-6 w-6" />
          </a>
        )}
      </div>
    </Card>
  );
};

export default EmployeeHeaderInfo;
