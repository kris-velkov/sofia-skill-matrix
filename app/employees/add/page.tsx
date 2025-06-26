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
import { useAuth } from "@/hooks/use-auth";

export default function AddEmployeePage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [state, formAction, isPending] = useActionState(createEmployee, null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      toast.error("You do not have permission to add employees.");
      router.push("/employees");
    }
  }, [isLoading, isAuthenticated, isAdmin, router]);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message);
      router.push("/employees");
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state, router]);

  if (isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <p className="text-gray-500">
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto grid gap-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-gray-700 hover:bg-gray-100"
            >
              <Link href="/employees" aria-label="Back to employees">
                <ChevronLeft className="h-6 w-6" />
              </Link>
            </Button>
            <h2 className="text-2xl font-bold text-gray-800">
              Add New Employee
            </h2>
          </div>
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-gray-600">
            Fill in the details below to add a new employee to the skills
            matrix.
          </p>

          <form action={formAction}>
            <Card className="p-6 shadow-md rounded-xl">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800">
                  Employee Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="grid gap-1">
                  <Label htmlFor="name" className="text-gray-500 text-sm">
                    Full Name
                  </Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="department" className="text-gray-500 text-sm">
                    Department
                  </Label>
                  <Input id="department" name="department" required />
                </div>
                <div className="grid gap-1">
                  <Label
                    htmlFor="careerExperience"
                    className="text-gray-500 text-sm"
                  >
                    Career Experience
                  </Label>
                  <Input id="careerExperience" name="careerExperience" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="badge" className="text-gray-500 text-sm">
                    Badge
                  </Label>
                  <Input id="badge" name="badge" />
                </div>
                <div className="grid gap-1 col-span-full">
                  <Label htmlFor="bio" className="text-gray-500 text-sm">
                    Bio
                  </Label>
                  <Textarea id="bio" name="bio" rows={3} />
                </div>
                <div className="grid gap-1 col-span-full">
                  <Label
                    htmlFor="slackProfileImage"
                    className="text-gray-500 text-sm"
                  >
                    Slack Profile Image URL
                  </Label>
                  <Input
                    id="slackProfileImage"
                    name="slackProfileImage"
                    placeholder="e.g., https://example.com/my-slack-pic.jpg"
                  />
                </div>
                <input type="hidden" name="skills" value="[]" />
              </CardContent>
              <div className="flex justify-end mt-6">
                <Button type="submit" disabled={isPending}>
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
