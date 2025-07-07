import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Award, MapPin, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import InfoRow from "@/components/ui/info-row";
import { Employee } from "@/lib/types";
import { getExperienceFromDate } from "@/lib/utils";

interface EmployeePersonalInfoProps {
  employee: Partial<Employee>;
}

export const EmployeePersonalInfo: React.FC<EmployeePersonalInfoProps> = ({
  employee,
}) => {
  return (
    <Card className="p-8 shadow-lg border-0 bg-white/90">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Personal Information
        </CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-7 text-gray-800">
        <InfoRow
          label="First Name"
          value={employee.firstName}
          icon={<User className="h-5 w-5 text-blue-500" />}
        />
        <InfoRow
          label="Last Name"
          value={employee.lastName}
          icon={<User className="h-5 w-5 text-blue-500" />}
        />
        <InfoRow
          label="Program"
          value={employee.program}
          icon={<Briefcase className="h-5 w-5 text-blue-500" />}
        />
        <InfoRow
          label="Department"
          value={employee.department}
          icon={<Briefcase className="h-5 w-5 text-blue-500" />}
        />
        <InfoRow
          label="Role"
          value={employee.role}
          icon={<Briefcase className="h-5 w-5 text-blue-500" />}
        />
        {employee.careerExperience && (
          <InfoRow
            label="Career Experience"
            value={getExperienceFromDate(employee.careerExperience)}
            icon={<Award className="h-5 w-5 text-blue-500" />}
          />
        )}
        <InfoRow
          label="Country"
          value={employee.country}
          icon={<MapPin className="h-5 w-5 text-blue-500" />}
        />
        <InfoRow
          label="City"
          value={employee.city}
          icon={<MapPin className="h-5 w-5 text-blue-500" />}
        />
        {employee.bio && (
          <div className="col-span-1 md:col-span-2 text-gray-900  rounded-lg p-4 border border-blue-100 shadow-sm">
            <Label className="text-xs text-gray-500 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-400" />
              Bio
            </Label>
            <div className="mt-2 text-base font-medium">{employee.bio}</div>
          </div>
        )}
      </div>
      <Separator className="my-6" />
    </Card>
  );
};

export default EmployeePersonalInfo;
