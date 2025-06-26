import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import toast from "react-hot-toast";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { EmployeeEditHeader } from "@/components/employees/employee-edit-header";
import { EmployeeEditPersonalForm } from "@/components/employees/employee-edit-personal-form";
import { EmployeeEditAddressForm } from "@/components/employees/employee-edit-address-form";
import { EmployeeEditSkillsSection } from "@/components/employees/employee-edit-skills-section";
import { EmployeeAddSkillDialog } from "@/components/employees/employee-add-skill-dialog";
import {
    deleteEmployeeAction,
    updateEmployeeAction,
    updateEmployeeSkillsAction,
} from "@/app/actions";
import { SkillLevel, Employee, Skill, SkillCategory } from "@/lib/types";

// --- Reusable UI blocks ---
function LoadingBlock({ message }: { message: string }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
                <p className="text-gray-500">{message}</p>
            </main>
        </div>
    );
}

function ErrorBlock({ error }: { error: string }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </main>
        </div>
    );
}

function NotFoundBlock({ message }: { message: string }) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
                <p className="text-gray-500">{message}</p>
            </main>
        </div>
    );
}

function EmployeeEditBreadcrumbs({ employee }: { employee: Employee }) {
    const items = [
        { label: "Home", href: "/" },
        { label: "Employees", href: "/employees" },
        { label: employee.name, href: `/employees/${employee.id}` },
        { label: "Edit" },
    ];
    return <Breadcrumbs items={items} />;
}

function EmployeeEditPageHeader({ employee }: { employee: Employee }) {
    return (
        <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-gray-700 hover:bg-gray-100"
            >
                <Link href={`/employees/${employee.id}`} aria-label="Back to employee profile">
                    <ChevronLeft className="h-6 w-6" />
                </Link>
            </Button>
            <h2 className="text-2xl font-bold text-gray-800">
                Edit Employee: {employee.name}
            </h2>
        </div>
    );
}

// --- Main Shell ---
export function EmployeeEditPageShell() {
    const params = useParams();
    const router = useRouter();
    const employeeId = params.id as string;

    const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();

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
    const [currentCategoryForNewSkill, setCurrentCategoryForNewSkill] = useState<string | null>(null);

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
            } catch (err: any) {
                setError(err.message || "Failed to load employee data.");
                toast.error(err.message || "Failed to load employee data.");
                router.push("/employees");
            } finally {
                setIsLoading(false);
            }
        };
        if (isAuthenticated && isAdmin) fetchData();
    }, [employeeId, router, isAuthenticated, isAdmin, authLoading]);

    useEffect(() => {
        if (personalState?.message) {
            if (personalState.success) {
                toast.success(personalState.message);
                setEditMode((prev) => ({ ...prev, personal: false }));
            } else {
                toast.error(personalState.message);
            }
        }
    }, [personalState, employeeId]);

    useEffect(() => {
        if (addressState?.message) {
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

    const handleDeleteSkill = async (categoryName: string, skillName: string) => {
        if (!employee) return;
        if (
            window.confirm(
                `Are you sure you want to delete the skill "${skillName}"?`
            )
        ) {
            const updatedSkills = employee.skills.map((category) => {
                if (category.name === categoryName) {
                    return {
                        ...category,
                        skills: category.skills.filter((skill) => skill.name !== skillName),
                    };
                }
                return category;
            });
            setEmployee((prev) => (prev ? { ...prev, skills: updatedSkills } : null));
            const result = await updateEmployeeSkillsAction(
                employee.id,
                updatedSkills
            );
            if (!result.success) {
                toast.error(result.message);
            } else {
                toast.success(result.message);
            }
        }
    };

    const handleDeleteEmployee = async () => {
        if (!employee) return;
        if (
            window.confirm(
                `Are you sure you want to delete ${employee.name}? This action cannot be undone.`
            )
        ) {
            const result = await deleteEmployeeAction(employee.id);
            if (result?.message) {
                toast.error(result.message);
            } else {
                toast.success(`${employee.name} deleted successfully!`);
                router.push("/employees");
            }
        }
    };

    // --- Render ---
    if (authLoading || isLoading || !isAuthenticated || !isAdmin) {
        return (
            <LoadingBlock
                message={
                    authLoading || isLoading
                        ? "Loading employee data..."
                        : "Redirecting, insufficient permissions to edit..."
                }
            />
        );
    }
    if (error) return <ErrorBlock error={error} />;
    if (!employee) return <NotFoundBlock message="Employee data not available." />;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <main className="flex-1 p-4 md:p-6">
                <div className="max-w-4xl mx-auto grid gap-6">
                    <div className="flex items-center justify-between">
                        <EmployeeEditPageHeader employee={employee} />
                    </div>
                    <EmployeeEditBreadcrumbs employee={employee} />
                    <p className="text-gray-600">
                        Update the details and skill levels for {employee.name}.
                    </p>
                    <EmployeeEditHeader
                        employee={employee}
                        isAdmin={isAdmin}
                        onDelete={handleDeleteEmployee}
                    />
                    <EmployeeEditPersonalForm
                        employee={employee}
                        isAdmin={isAdmin}
                        editMode={editMode.personal}
                        personalState={personalState}
                        onEdit={() => setEditMode({ ...editMode, personal: true })}
                        onCancel={() => setEditMode({ ...editMode, personal: false })}
                        onSave={(formData) => handleSaveSection("personal", formData)}
                        onInputChange={handleInputChange}
                    />
                    <EmployeeEditAddressForm
                        employee={employee}
                        isAdmin={isAdmin}
                        editMode={editMode.address}
                        addressState={addressState}
                        onEdit={() => setEditMode({ ...editMode, address: true })}
                        onCancel={() => setEditMode({ ...editMode, address: false })}
                        onSave={(formData) => handleSaveSection("address", formData)}
                        onInputChange={handleInputChange}
                    />
                    <EmployeeEditSkillsSection
                        skills={employee.skills}
                        isAdmin={isAdmin}
                        onSkillChange={handleSkillChange}
                        onDeleteSkill={handleDeleteSkill}
                        onAddSkill={(categoryName) => {
                            setCurrentCategoryForNewSkill(categoryName);
                            setIsAddSkillDialogOpen(true);
                        }}
                    />
                </div>
            </main>
            {isAdmin && (
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
            )}
        </div>
    );
}
