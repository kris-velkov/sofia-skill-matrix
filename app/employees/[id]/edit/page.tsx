import { notFound } from "next/navigation";
import { getEmployeeById } from "@/lib/db";
import {} from "@/components/employees/card/employee-skill-card";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import EmployeeEditHeaderInfo from "@/components/employees/edit/employee-edit-header-info";
import EmployeeEditPersonalInfo from "@/components/employees/edit/employee-edit-personal-info";
import EmployeeEditCertificates from "@/components/employees/edit/employee-edit-certificates";
import EmployeeEditSkills from "@/components/employees/edit/employee-edit-skills-section";

export default async function EditEmployeeProfilePage({
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
    {
      label: employee?.firstName + " " + employee?.lastName,
      href: `/employees/${id}`,
    },
    { label: "Edit" },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
      <div className="w-full max-w-4xl space-y-8 mt-8">
        <Breadcrumbs items={breadcrumbItems} />
        <EmployeeEditHeaderInfo employee={employee} />
        <EmployeeEditPersonalInfo employee={employee} />
        <EmployeeEditCertificates
          employeeId={employee.id}
          certificates={employee?.certificates ?? []}
        />
        <EmployeeEditSkills employeeId={employee.id} skills={employee.skills} />
      </div>
    </main>
  );
}
