import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import EmployeePersonalInfo from "@/components/employees/profile/employee-personal-info";
import EmployeeSkillsInfo from "@/components/employees/profile/employee-skills-info";
import EmployeeCertificatesInfo from "@/components/employees/profile/employee-certificates-info";
import EmployeeHeaderInfo from "@/components/employees/profile/employee-header-info";
import { getEmployee } from "@/app/actions/employees-action";

export default async function Page({
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
    { label: "Home", href: "/" },
    { label: `${employee.firstName} ${employee.lastName}` },
  ];

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-8 mt-8">
        <Breadcrumbs items={breadcrumbItems} />
        <EmployeeHeaderInfo employee={employee} />
        <EmployeePersonalInfo employee={employee} />
        {employee.certificates && (
          <EmployeeCertificatesInfo certificates={employee.certificates} />
        )}
        <EmployeeSkillsInfo skills={employee.skills} />
      </div>
    </section>
  );
}
