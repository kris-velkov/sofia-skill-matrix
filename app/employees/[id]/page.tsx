import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import EmployeePersonalInfo from "@/components/employees/profile/employee-personal-info";
import EmployeeSkillsInfo from "@/components/employees/profile/employee-skills-info";
import EmployeeCertificatesInfo from "@/components/employees/profile/employee-certificates-info";
import EmployeeHeaderInfo from "@/components/employees/profile/employee-header-info";
import { Metadata } from "next";
import { getEmployee } from "@/app/actions/employee-actions";

export const metadata: Metadata = {
  title: "View Employees – Jakala Skill Matrix",
  description: "View, edit, add, and delete employee details and skills.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function EmployeeProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = await getEmployee(id);

  if (!employee) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Employees", href: "/employees" },
    {
      label: `${employee.firstName} ${employee.lastName}`,
      href: `/employees/${employee.id}`,
    },
  ];

  return (
    <section
      className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8"
      aria-labelledby="employee-profile-title"
    >
      <div className="w-full max-w-4xl space-y-8 mt-8">
        <Breadcrumbs items={breadcrumbItems} />
        <EmployeeHeaderInfo employee={employee} />
        <EmployeePersonalInfo employee={employee} />
        {!!employee.certificates && (
          <EmployeeCertificatesInfo certificates={employee.certificates} />
        )}
        {!!employee.skills && <EmployeeSkillsInfo skills={employee.skills} />}
      </div>
    </section>
  );
}
