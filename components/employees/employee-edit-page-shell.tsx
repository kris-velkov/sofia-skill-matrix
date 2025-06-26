import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useActionState } from "react";
import { EmployeeEditPersonalForm } from "@/components/employees/employee-edit-personal-form";
import { EmployeeEditAddressForm } from "@/components/employees/employee-edit-address-form";
import { EmployeeEditSkillsSection } from "@/components/employees/employee-edit-skills-section";
import { EmployeeAddSkillDialog } from "@/components/employees/employee-add-skill-dialog";
import { EmployeeCertificates } from "@/components/employees/employee-certificates";
import {
  deleteEmployeeAction,
  updateEmployeeAction,
  updateEmployeeSkillsAction,
} from "@/app/actions/actions";
import { SkillLevel, Employee, Skill, SkillCategory } from "@/lib/types";
import {
  LoadingBlock,
  ErrorBlock,
  NotFoundBlock,
} from "@/components/ui/blocks";
import { useAuthStore } from "@/store/use-auth-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Toaster } from "@/components/ui/toaster";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

export function EmployeeEditPageShell() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const { isLoggedIn, role, hydrated } = useAuthStore();
  const isAuthenticated = isLoggedIn;
  const isAdmin = role === "admin";
  const authLoading = !hydrated;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [personalState, personalFormAction] = useActionState(
    updateEmployeeAction,
    null
  );
  const [addressState, addressFormAction] = useActionState(
    updateEmployeeAction,
    null
  );

  const [editMode, setEditMode] = useState({ personal: false, address: false });
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>(0);
  const [newSkillUrl, setNewSkillUrl] = useState("");
  const [currentCategoryForNewSkill, setCurrentCategoryForNewSkill] = useState<
    string | null
  >(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description?: string;
    onConfirm: (() => void) | undefined;
  }>({ open: false, title: "", description: undefined, onConfirm: undefined });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast.error("You do not have permission to edit employees.");
      router.push(`/employees/${employeeId}`);
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/employees/${employeeId}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const foundEmployee = await response.json();
        if (foundEmployee) setEmployee(foundEmployee);
        else {
          router.push("/employees");
          toast.error("Employee not found.");
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to load employee data.";
        setError(errorMsg);
        toast.error(errorMsg);
        router.push("/employees");
      } finally {
        setIsLoading(false);
      }
    };
    if (isAuthenticated && isAdmin) fetchData();
  }, [employeeId, router, isAuthenticated, isAdmin, authLoading]);

  useEffect(() => {
    if (
      personalState &&
      typeof personalState === "object" &&
      "message" in personalState
    ) {
      if (personalState.success) {
        toast.success(personalState.message);
        setEditMode((prev) => ({ ...prev, personal: false }));
      } else {
        toast.error(personalState.message);
      }
    }
  }, [personalState, employeeId]);

  useEffect(() => {
    if (
      addressState &&
      typeof addressState === "object" &&
      "message" in addressState
    ) {
      if (addressState.success) {
        toast.success(addressState.message);
        setEditMode((prev) => ({ ...prev, address: false }));
      } else {
        toast.error(addressState.message);
      }
    }
  }, [addressState, employeeId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setEmployee((prev) => (prev ? { ...prev, [id]: value } : null));
  };

  const handleSaveSection = async (
    section: "personal" | "address",
    formData: FormData
  ) => {
    if (!employee) return;
    formData.append("id", employee.id);
    if (section === "personal") personalFormAction(formData);
    else if (section === "address") addressFormAction(formData);
  };

  const handleSkillChange = async (
    categoryName: string,
    skillName: string,
    field: "level" | "url",
    value: string | SkillLevel
  ) => {
    if (!employee) return;
    const updatedSkills = employee.skills.map((category: SkillCategory) => {
      if (category.name === categoryName) {
        const updatedCategorySkills = category.skills.map((skill: Skill) =>
          skill.name === skillName
            ? {
                ...skill,
                [field]:
                  field === "level"
                    ? (Number.parseInt(value as string) as SkillLevel)
                    : value,
              }
            : skill
        );
        return { ...category, skills: updatedCategorySkills };
      }
      return category;
    });
    setEmployee((prev) => (prev ? { ...prev, skills: updatedSkills } : null));
    const result = await updateEmployeeSkillsAction(employee.id, updatedSkills);
    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
  };

  const handleAddSkill = async () => {
    if (!employee || !currentCategoryForNewSkill || !newSkillName) {
      toast.error("Skill name and category are required.");
      return;
    }
    const updatedSkills = employee.skills.map((category) => {
      if (category.name === currentCategoryForNewSkill) {
        if (
          category.skills.some(
            (s) => s.name.toLowerCase() === newSkillName.toLowerCase()
          )
        ) {
          toast.error(
            `Skill "${newSkillName}" already exists in this category.`
          );
          return category;
        }
        const newSkill: Skill = {
          name: newSkillName,
          level: newSkillLevel,
          url: newSkillUrl || undefined,
        };
        return { ...category, skills: [...category.skills, newSkill] };
      }
      return category;
    });
    setEmployee((prev) => (prev ? { ...prev, skills: updatedSkills } : null));
    const result = await updateEmployeeSkillsAction(employee.id, updatedSkills);
    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
    setIsAddSkillDialogOpen(false);
    setNewSkillName("");
    setNewSkillLevel(0);
    setNewSkillUrl("");
    setCurrentCategoryForNewSkill(null);
  };

  const handleDeleteSkill = (categoryName: string, skillName: string) => {
    setConfirmDialog({
      open: true,
      title: `Delete skill "${skillName}"?`,
      description: `Are you sure you want to delete the skill "${skillName}"?`,
      onConfirm: async () => {
        if (!employee) return;
        const updatedSkills = employee.skills.map((category) => {
          if (category.name === categoryName) {
            return {
              ...category,
              skills: category.skills.filter(
                (skill) => skill.name !== skillName
              ),
            };
          }
          return category;
        });
        setEmployee((prev) =>
          prev ? { ...prev, skills: updatedSkills } : null
        );
        const result = await updateEmployeeSkillsAction(
          employee.id,
          updatedSkills
        );
        if (!result.success) {
          toast.error(result.message);
        } else {
          toast.success(result.message);
        }
        setConfirmDialog((d) => ({ ...d, open: false, onConfirm: undefined }));
      },
    });
  };

  const handleDeleteEmployee = () => {
    setConfirmDialog({
      open: true,
      title: `Delete ${employee?.name}?`,
      description: `Are you sure you want to delete ${employee?.name}? This action cannot be undone.`,
      onConfirm: async () => {
        if (!employee) return;
        const result = await deleteEmployeeAction(employee.id);
        if (!result.success) {
          toast.error(result.message);
        } else {
          toast.success(result.message);
          router.push("/employees");
        }
        setConfirmDialog((d) => ({ ...d, open: false, onConfirm: undefined }));
      },
    });
  };

  if (isLoading) return <LoadingBlock message="Loading..." />;
  if (error) return <ErrorBlock error={error} />;
  if (!employee) return <NotFoundBlock message="Employee not found." />;

  // Breadcrumbs for navigation
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Employees", href: "/employees" },
    { label: employee.name },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-8 bg-gradient-to-tr from-blue-100/60 to-white">
      <div className="w-full max-w-4xl space-y-8 mt-8">
        <Breadcrumbs items={breadcrumbItems} />
        {/* Header Card */}
        <Card className="p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-xl border-0 bg-gradient-to-tr from-blue-100/60 to-white">
          <div className="h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-blue-400 shadow-lg overflow-hidden flex items-center justify-center bg-white">
            <img
              src={
                employee.slackProfileImage ||
                "/placeholder.svg?height=128&width=128&query=user+avatar"
              }
              alt={`${employee.name} profile`}
              className="object-cover w-full h-full"
            />
          </div>
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
              <span className="mt-2 px-4 py-1 text-base bg-blue-200 text-blue-800 font-semibold shadow rounded">
                {employee.badge}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-4 mt-6 md:mt-0 items-center">
            <Button
              variant="destructive"
              onClick={handleDeleteEmployee}
              className="bg-red-600 hover:bg-red-700 text-white mt-2"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Employee
            </Button>
          </div>
        </Card>
        {/* Personal Information Card */}
        <EmployeeEditPersonalForm
          employee={employee}
          isAdmin={isAdmin}
          editMode={editMode.personal}
          personalState={personalState}
          onEdit={() => setEditMode((prev) => ({ ...prev, personal: true }))}
          onCancel={() => setEditMode((prev) => ({ ...prev, personal: false }))}
          onSave={(data) => handleSaveSection("personal", data)}
          onInputChange={handleInputChange}
        />
        {/* Address Card */}
        <EmployeeEditAddressForm
          employee={employee}
          isAdmin={isAdmin}
          editMode={editMode.address}
          addressState={addressState}
          onEdit={() => setEditMode((prev) => ({ ...prev, address: true }))}
          onCancel={() => setEditMode((prev) => ({ ...prev, address: false }))}
          onSave={(data) => handleSaveSection("address", data)}
          onInputChange={handleInputChange}
        />
        {/* Skills Card */}
        <Card className="p-6 shadow-lg border border-blue-100 bg-white">
          <EmployeeEditSkillsSection
            skills={employee.skills}
            isAdmin={isAdmin}
            onSkillChange={handleSkillChange}
            onDeleteSkill={handleDeleteSkill}
            onAddSkill={() => setIsAddSkillDialogOpen(true)}
          />
        </Card>
        {/* Certificates Card */}
        <Card className="p-6 shadow-lg border border-blue-100 bg-white">
          <EmployeeCertificates
            employeeId={employee.id}
            certificates={employee.certificates || []}
          />
        </Card>
      </div>
      <Toaster />
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onCancel={() =>
          setConfirmDialog((d) => ({ ...d, open: false, onConfirm: undefined }))
        }
        onConfirm={confirmDialog.onConfirm || (() => {})}
      />
      <EmployeeAddSkillDialog
        open={isAddSkillDialogOpen}
        onOpenChange={setIsAddSkillDialogOpen}
        currentCategory={currentCategoryForNewSkill}
        newSkillName={newSkillName}
        setNewSkillName={setNewSkillName}
        newSkillLevel={newSkillLevel}
        setNewSkillLevel={setNewSkillLevel}
        newSkillUrl={newSkillUrl}
        setNewSkillUrl={setNewSkillUrl}
        onAddSkill={handleAddSkill}
      />
    </main>
  );
}
