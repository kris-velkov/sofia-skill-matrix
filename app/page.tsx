import { Dashboard } from "@/components/dashboard/dashboard";
import ProtectedRoute from "@/components/auth/protected-route";
import { Suspense } from "react";
import { seedCategories } from "@/lib/skillsDB";
import {
  DEFAULT_CATEGORIES_FE_BE,
  DEFAULT_CATEGORIES_PM,
  DEFAULT_CATEGORIES_QA,
} from "@/constants/employeeDefaultsSkills";
import { seedEmployeesFromJson } from "@/lib/db";
import { getEmployeesData } from "./actions/employees-action";

export const metadata = {
  title: "Skills Matrix Dashboard",
  description: "Track and manage employee skills at a glance.",
};

export default async function HomePage() {
  const employees = await getEmployeesData();

  // console.log(employees);

  // await seedCategories(DEFAULT_CATEGORIES_FE_BE, ["frontend", "backend"]);
  // await seedCategories(DEFAULT_CATEGORIES_QA, ["qa"]);
  // await seedCategories(DEFAULT_CATEGORIES_PM, ["pm"]);

  // await seedEmployeesFromJson();

  return (
    <ProtectedRoute>
      <section
        className="max-w-7xl mx-auto grid gap-10 mt-10 w-full "
        aria-labelledby="skills-matrix-heading"
      >
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-5">
          Skills Matrix Dashboard
        </h1>
        <Suspense
          fallback={<p className="text-center">Loading dashboard...</p>}
        >
          <Dashboard employees={employees} />
        </Suspense>
      </section>
    </ProtectedRoute>
  );
}
