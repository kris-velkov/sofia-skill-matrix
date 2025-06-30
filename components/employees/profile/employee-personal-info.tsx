import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Briefcase, Award, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import InfoRow from "@/components/ui/info-row";

interface EmployeePersonalInfoProps {
  employee: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    department?: string;
    careerExperience?: string;
    bio?: string;
    country?: string;
    cityState?: string;
    postalCode?: string;
  };
}

export const EmployeePersonalInfo: React.FC<EmployeePersonalInfoProps> = ({
  employee,
}) => {
  const location = [employee.cityState, employee.country, employee.postalCode]
    .filter(Boolean)
    .join(", ");

  return (
    <Card className="p-8 shadow-lg border-0 bg-white/90">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Personal Information
        </CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-gray-700">
        <InfoRow label="First Name" value={employee.firstName} />
        <InfoRow label="Last Name" value={employee.lastName} />
        <InfoRow
          label="Email address"
          value={employee.email}
          icon={<Mail className="h-4 w-4 text-blue-400" />}
        />
        <InfoRow
          label="Phone"
          value={employee.phone}
          icon={<Phone className="h-4 w-4 text-blue-400" />}
        />
        <InfoRow
          label="Department"
          value={employee.department}
          icon={<Briefcase className="h-4 w-4 text-blue-400" />}
          badge={!!employee.department}
        />
        <InfoRow
          label="Career Experience"
          value={employee.careerExperience}
          icon={<Award className="h-4 w-4 text-blue-400" />}
        />
        {employee.bio && (
          <div className="col-span-1 md:col-span-2">
            <Label className="text-xs text-gray-500">Bio</Label>
            <div className="mt-1 text-base font-medium text-gray-900 bg-gray-50 rounded p-3 border border-gray-100">
              {employee.bio}
            </div>
          </div>
        )}
        {(employee.country || employee.cityState || employee.postalCode) && (
          <div className="col-span-1 md:col-span-2">
            <Label className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="h-4 w-4 text-blue-400" />
              Location
            </Label>
            <span className="text-base font-medium text-gray-900 flex items-center gap-2 mt-1">
              {location || "N/A"}
            </span>
          </div>
        )}
      </div>
      <Separator className="my-6" />
    </Card>
  );
};

export default EmployeePersonalInfo;
