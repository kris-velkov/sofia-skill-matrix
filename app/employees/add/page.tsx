"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { createEmployee } from "@/app/actions";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";

export default function AddEmployeePage() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const role = useAuthStore((s) => s.role);
  const [state, formAction, isPending] = useActionState(createEmployee, null);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("You do not have permission to add employees.");
      router.push("/employees");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/employees");
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  const isLoading = false;

  if (isLoading || !isLoggedIn || role !== "admin") {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
        <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <p className="text-gray-500 text-lg font-medium">
            {isLoading
              ? "Loading..."
              : "Redirecting, insufficient permissions..."}
          </p>
        </main>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Employees", href: "/employees" },
    { label: "Add New Employee" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto grid gap-8">
          <div className="flex items-center gap-4 mb-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-gray-700 hover:bg-gray-200 transition"
            >
              <Link href="/employees" aria-label="Back to employees">
                <ChevronLeft className="h-6 w-6" />
              </Link>
            </Button>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              Add New Employee
            </h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-gray-600 text-lg mb-2">
            Fill in the details below to add a new employee to the skills
            matrix.
          </p>

          <form action={formAction} className="w-full">
            <Card className="p-8 shadow-xl rounded-2xl border border-gray-200 bg-white/90 backdrop-blur">
              <CardHeader className="p-0 pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Employee Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                <div className="grid gap-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-700 text-base font-medium"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Ivan Ivanov"
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="department"
                    className="text-gray-700 text-base font-medium"
                  >
                    Department <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="department"
                    name="department"
                    required
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Frontend Development"
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="careerExperience"
                    className="text-gray-700 text-base font-medium"
                  >
                    Career Experience
                  </Label>
                  <Input
                    id="careerExperience"
                    name="careerExperience"
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. 5 years"
                  />
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="badge"
                    className="text-gray-700 text-base font-medium"
                  >
                    Badge
                  </Label>
                  <Input
                    id="badge"
                    name="badge"
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400"
                    placeholder="e.g. Frotend-end"
                  />
                </div>
                <div className="grid gap-2 col-span-full">
                  <Label
                    htmlFor="bio"
                    className="text-gray-700 text-base font-medium"
                  >
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400"
                    placeholder="Short bio about the employee..."
                  />
                </div>
                <div className="grid gap-2 col-span-full">
                  <Label
                    htmlFor="slackProfileImage"
                    className="text-gray-700 text-base font-medium"
                  >
                    Slack Profile Image URL
                  </Label>
                  <Input
                    id="slackProfileImage"
                    name="slackProfileImage"
                    placeholder="e.g., https://example.com/my-slack-pic.jpg"
                    className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <input type="hidden" name="skills" value="[]" />
              </CardContent>
              <div className="flex justify-end mt-8">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="px-8 py-2 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow transition"
                >
                  {isPending ? "Adding..." : "Add Employee"}
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </main>
    </div>
  );
}
