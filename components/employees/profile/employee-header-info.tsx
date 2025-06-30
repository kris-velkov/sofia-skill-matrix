"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Slack } from "lucide-react";
import { fetchFloatUserInfo } from "@/app/actions/float-actions";

// Import your new fetch function

type Employee = {
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  cityState?: string;
  country?: string;
  badge?: string;
  slackProfileImage?: string;
  linkedinUrl?: string;
  slackUrl?: string;
};

// Define a type for the Float API response
interface FloatApiResponse {
  found: boolean;
  isFree?: boolean;
  projects?: string[];
  error?: string;
}

interface EmployeeHeaderInfoProps {
  employee: Employee;
}

export const EmployeeHeaderInfo: React.FC<EmployeeHeaderInfoProps> = ({
  employee,
}) => {
  const [floatInfo, setFloatInfo] = useState<null | {
    isFree: boolean;
    projects: string[];
  }>(null);
  const [floatError, setFloatError] = useState<string | null>(null);

  useEffect(() => {
    if (employee.email) {
      fetchFloatUserInfo("Kristiyan.Velkov@ffw.com")
        .then((res: FloatApiResponse) => {
          if (
            res &&
            res.found &&
            typeof res.isFree === "boolean" &&
            Array.isArray(res.projects)
          ) {
            setFloatInfo({ isFree: res.isFree, projects: res.projects });
            setFloatError(null);
          } else if (res && res.error) {
            setFloatInfo(null);
            setFloatError(res.error);
          } else {
            setFloatInfo(null);
            setFloatError("Float info not found.");
          }
        })
        .catch(() => {
          setFloatInfo(null);
          setFloatError("Error fetching Float info.");
        });
    } else {
      setFloatInfo(null);
      setFloatError(null);
    }
  }, [employee.email]);

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
        {/* Float info badges/messages */}
        {floatInfo && (
          <div className="mt-3 flex flex-wrap gap-2 items-center justify-center md:justify-start">
            {floatInfo.isFree ? (
              <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1 text-sm font-semibold">
                Free
              </Badge>
            ) : (
              floatInfo.projects.map((p) => (
                <Badge
                  key={p}
                  className="bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1 text-sm font-semibold"
                >
                  On project: {p}
                </Badge>
              ))
            )}
          </div>
        )}
        {floatError && (
          <div className="mt-3 flex flex-wrap gap-2 items-center justify-center md:justify-start">
            <Badge className="bg-gray-200 text-gray-700 border-gray-300 px-3 py-1 text-sm font-semibold">
              Float: {floatError}
            </Badge>
          </div>
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
