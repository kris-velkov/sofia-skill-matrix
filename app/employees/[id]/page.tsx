import { notFound } from "next/navigation";
import { getEmployeeById } from "@/lib/db"; // Import server-side data fetching
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Slack,
  Linkedin,
  Pencil,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {} from "@/components/dashboard/employee-skill-card";
import { Breadcrumbs } from "@/components/breadcrumbs";

export default async function EmployeeProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Employees", href: "/employees" },
    { label: employee.name },
  ];
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-8 mt-8">
        <Breadcrumbs items={breadcrumbItems} />
        {/* Header Card */}
        <Card className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl border-0 bg-gradient-to-tr from-blue-100/60 to-white">
          <Avatar className="h-28 w-28 md:h-36 md:w-36 border-4 border-blue-400 shadow-lg">
            <AvatarImage
              src={
                employee.slackProfileImage ||
                "/placeholder.svg?height=128&width=128&query=user+avatar"
              }
              alt={`${employee.name} profile`}
            />
          </Avatar>
          <div className="flex-1 text-center md:text-left space-y-2">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {employee.name}
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
        {/* Personal Information Card */}
        <Card className="p-8 shadow-lg border-0 bg-white/90">
          <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Personal Information
            </CardTitle>
            <Link href={`/employees/${employee.id}/edit`}>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-blue-200"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-gray-700">
            <div>
              <p className="text-sm font-medium text-gray-500">First Name</p>
              <p className="text-lg font-semibold">
                {employee.firstName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Name</p>
              <p className="text-lg font-semibold">
                {employee.lastName || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email address</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                {employee.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" />
                {employee.phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Department</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-400" />
                {employee.department || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Career Experience
              </p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-400" />
                {employee.careerExperience || "N/A"}
              </p>
            </div>
            {employee.bio && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Bio</p>
                <p className="text-lg font-semibold">{employee.bio}</p>
              </div>
            )}
            {(employee.country ||
              employee.cityState ||
              employee.postalCode) && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-400" />
                  {[employee.cityState, employee.country, employee.postalCode]
                    .filter(Boolean)
                    .join(", ") || "N/A"}
                </p>
              </div>
            )}
          </div>
        </Card>
        <Card className="p-6 shadow-lg border border-blue-100 bg-white">
          <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-blue-500" />
              Skills
            </CardTitle>
          </CardHeader>
          {employee.skills.length > 0 ? (
            <div className="space-y-10">
              {employee.skills
                .filter(
                  (category) => category.skills && category.skills.length > 0
                )
                .map((category, idx, arr) => (
                  <div key={category.name}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-400" />
                      <h3 className="text-xl font-bold text-gray-800">
                        {category.name}
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {category.skills.map((skill) => (
                        <div
                          key={skill.name}
                          className="flex items-center gap-4"
                        >
                          {skill.name}
                          <div className="flex-1">
                            <div className="w-full bg-blue-100 rounded-full h-3 relative overflow-hidden">
                              <div
                                className="bg-blue-500 h-3 rounded-full transition-all"
                                style={{
                                  width: `${(skill.level / 4) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                          <span className="text-sm text-blue-700 font-bold min-w-[32px] text-right">
                            {skill.level}/4
                          </span>
                        </div>
                      ))}
                    </div>
                    {idx !== arr.length - 1 && <Separator className="my-8" />}
                  </div>
                ))}
              {employee.skills.filter(
                (category) => category.skills && category.skills.length > 0
              ).length === 0 && (
                <p className="text-gray-600 italic">
                  No skills listed for this employee.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-600 italic">
              No skills listed for this employee.
            </p>
          )}
        </Card>
      </div>
    </main>
  );
}
