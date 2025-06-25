import { notFound } from "next/navigation"
import { getEmployeeById } from "@/lib/db" // Import server-side data fetching
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Mail, Phone, MapPin, Briefcase, Slack, Linkedin, Pencil, Award, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSkillLevelColor, getSkillIcon } from "@/components/dashboard/employee-skill-card" // Reusing helper functions
import { Breadcrumbs } from "@/components/breadcrumbs"

export default async function EmployeeProfilePage({ params }: { params: { id: string } }) {
  const employee = await getEmployeeById(params.id) // Fetch employee on the server

  if (!employee) {
    notFound() // Use Next.js notFound function for 404
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Employees", href: "/employees" },
    { label: employee.name },
  ]

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6 lg:p-8">
      <DashboardHeader /> {/* Include header for consistent layout */}
      <div className="w-full max-w-4xl space-y-6 mt-6">
        {" "}
        {/* Added mt-6 for spacing below header */}
        <Breadcrumbs items={breadcrumbItems} />
        {/* Header Card */}
        <Card className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-blue-500 dark:border-blue-400">
            <AvatarImage
              src={employee.slackProfileImage || "/placeholder.svg?height=128&width=128&query=user+avatar"}
              alt={`${employee.name} profile`}
            />
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-4xl">
              {employee.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{employee.name}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
              {employee.department}
              {employee.cityState && ` • ${employee.cityState}`}
              {employee.country && `, ${employee.country}`}
            </p>
            {employee.badge && (
              <Badge className="mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                {employee.badge}
              </Badge>
            )}
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            {employee.linkedinUrl && (
              <a
                href={employee.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-blue-400"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {employee.slackUrl && (
              <a
                href={employee.slackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-blue-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-blue-400"
                aria-label="Slack Profile"
              >
                <Slack className="h-5 w-5" />
              </a>
            )}
          </div>
        </Card>
        {/* Personal Information Card */}
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">
              Personal Information
            </CardTitle>
            <Link href={`/employees/${employee.id}/edit`}>
              <Button variant="outline" className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</p>
              <p className="text-lg font-semibold">{employee.firstName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</p>
              <p className="text-lg font-semibold">{employee.lastName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                {employee.email || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                {employee.phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Department</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                {employee.department || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Career Experience</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                {employee.careerExperience || "N/A"}
              </p>
            </div>
            {employee.bio && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</p>
                <p className="text-lg font-semibold">{employee.bio}</p>
              </div>
            )}
            {(employee.country || employee.cityState || employee.postalCode) && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {[employee.cityState, employee.country, employee.postalCode].filter(Boolean).join(", ") || "N/A"}
                </p>
              </div>
            )}
            {employee.taxId && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tax ID</p>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  {employee.taxId}
                </p>
              </div>
            )}
          </div>
        </Card>
        {/* Skills Card */}
        <Card className="p-6">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">Skills</CardTitle>
          </CardHeader>
          {employee.skills.length > 0 ? (
            <div className="space-y-6">
              {employee.skills.map((category) => (
                <div key={category.name}>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    {getSkillIcon(category.name)} {category.name}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {category.skills.map((skill) => (
                      <Badge
                        key={skill.name}
                        className={cn(
                          "px-3 py-1.5 text-sm font-medium flex items-center gap-2 rounded-full",
                          getSkillLevelColor(skill.level),
                        )}
                      >
                        {getSkillIcon(skill.name)}
                        {skill.name} ({skill.level})
                      </Badge>
                    ))}
                  </div>
                  <Separator className="my-4 last:hidden" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No skills listed for this employee.</p>
          )}
        </Card>
      </div>
    </main>
  )
}
