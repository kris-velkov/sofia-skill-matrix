"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Employee, SkillCategory, Skill, SkillLevel } from "@/lib/types"
import toast from "react-hot-toast"
import { Linkedin, Pencil, ChevronLeft, Plus, Trash2, LinkIcon } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Breadcrumbs } from "@/components/breadcrumbs"
import {
  updateEmployee as updateEmployeeAction,
  updateEmployeeSkills as updateEmployeeSkillsAction,
  deleteEmployee as deleteEmployeeAction,
} from "@/app/actions"
import { useActionState } from "react"
import { db } from "@/lib/db"
import { useAuth } from "@/hooks/use-auth" // Import useAuth

export default function EditEmployeePage() {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.id as string

  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth() // Get auth status

  const [employee, setEmployee] = useState<Employee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [personalState, personalFormAction] = useActionState(updateEmployeeAction, null)
  const [addressState, addressFormAction] = useActionState(updateEmployeeAction, null)

  // State to manage edit mode for each section
  const [editMode, setEditMode] = useState({
    personal: false,
    address: false,
  })

  // State for Add Skill Dialog
  const [isAddSkillDialogOpen, setIsAddSkillDialogOpen] = useState(false)
  const [newSkillName, setNewSkillName] = useState("")
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>(0)
  const [newSkillUrl, setNewSkillUrl] = useState("")
  const [currentCategoryForNewSkill, setCurrentCategoryForNewSkill] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      toast.error("You do not have permission to edit employees.")
      router.push(`/employees/${employeeId}`) // Redirect if not authenticated or not admin
      return
    }

    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const foundEmployee = await db.getEmployeeById(employeeId)
        if (foundEmployee) {
          setEmployee(JSON.parse(JSON.stringify(foundEmployee)))
        } else {
          router.push("/employees")
          toast.error("Employee not found.")
        }
      } catch (err: any) {
        console.error("Failed to fetch employee data:", err)
        setError(err.message || "Failed to load employee data.")
        toast.error(err.message || "Failed to load employee data.")
        router.push("/employees")
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && isAdmin) {
      fetchData()
    }
  }, [employeeId, router, isAuthenticated, isAdmin, authLoading])

  // Handle messages from Server Actions
  useEffect(() => {
    if (personalState?.message) {
      if (personalState.success) {
        toast.success(personalState.message)
        setEditMode((prev) => ({ ...prev, personal: false }))
        db.getEmployeeById(employeeId).then(setEmployee).catch(console.error)
      } else {
        toast.error(personalState.message)
      }
    }
  }, [personalState, employeeId])

  useEffect(() => {
    if (addressState?.message) {
      if (addressState.success) {
        toast.success(addressState.message)
        setEditMode((prev) => ({ ...prev, address: false }))
        db.getEmployeeById(employeeId).then(setEmployee).catch(console.error)
      } else {
        toast.error(addressState.message)
      }
    }
  }, [addressState, employeeId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setEmployee((prev) => (prev ? { ...prev, [id]: value } : null))
  }

  const handleSaveSection = async (section: "personal" | "address", formData: FormData) => {
    if (!employee) return

    formData.append("id", employee.id)

    if (section === "personal") {
      personalFormAction(formData)
    } else if (section === "address") {
      addressFormAction(formData)
    }
  }

  const handleSkillChange = async (
    categoryName: string,
    skillName: string,
    field: "level" | "url",
    value: string | SkillLevel,
  ) => {
    if (!employee) return

    const updatedSkills = employee.skills.map((category: SkillCategory) => {
      if (category.name === categoryName) {
        const updatedCategorySkills = category.skills.map((skill: Skill) =>
          skill.name === skillName
            ? { ...skill, [field]: field === "level" ? (Number.parseInt(value as string) as SkillLevel) : value }
            : skill,
        )
        return { ...category, skills: updatedCategorySkills }
      }
      return category
    })

    setEmployee((prev) => (prev ? { ...prev, skills: updatedSkills } : null))

    const result = await updateEmployeeSkillsAction(employee.id, updatedSkills)
    if (!result.success) {
      toast.error(result.message)
      const originalEmployee = await db.getEmployeeById(employee.id)
      if (originalEmployee) setEmployee(originalEmployee)
    } else {
      toast.success(result.message)
    }
  }

  const handleAddSkill = async () => {
    if (!employee || !currentCategoryForNewSkill || !newSkillName) {
      toast.error("Skill name and category are required.")
      return
    }

    const updatedSkills = employee.skills.map((category) => {
      if (category.name === currentCategoryForNewSkill) {
        if (category.skills.some((s) => s.name.toLowerCase() === newSkillName.toLowerCase())) {
          toast.error(`Skill "${newSkillName}" already exists in this category.`)
          return category
        }

        const newSkill: Skill = {
          name: newSkillName,
          level: newSkillLevel,
          url: newSkillUrl || undefined,
        }
        return { ...category, skills: [...category.skills, newSkill] }
      }
      return category
    })

    setEmployee((prev) => (prev ? { ...prev, skills: updatedSkills } : null))

    const result = await updateEmployeeSkillsAction(employee.id, updatedSkills)
    if (!result.success) {
      toast.error(result.message)
      const originalEmployee = await db.getEmployeeById(employee.id)
      if (originalEmployee) setEmployee(originalEmployee)
    } else {
      toast.success(result.message)
    }

    setIsAddSkillDialogOpen(false)
    setNewSkillName("")
    setNewSkillLevel(0)
    setNewSkillUrl("")
    setCurrentCategoryForNewSkill(null)
  }

  const handleDeleteSkill = async (categoryName: string, skillName: string) => {
    if (!employee) return
    if (window.confirm(`Are you sure you want to delete the skill "${skillName}"?`)) {
      const updatedSkills = employee.skills.map((category) => {
        if (category.name === categoryName) {
          return { ...category, skills: category.skills.filter((skill) => skill.name !== skillName) }
        }
        return category
      })

      setEmployee((prev) => (prev ? { ...prev, skills: updatedSkills } : null))

      const result = await updateEmployeeSkillsAction(employee.id, updatedSkills)
      if (!result.success) {
        toast.error(result.message)
        const originalEmployee = await db.getEmployeeById(employee.id)
        if (originalEmployee) setEmployee(originalEmployee)
      } else {
        toast.success(result.message)
      }
    }
  }

  const handleDeleteEmployee = async () => {
    if (!employee) return
    if (window.confirm(`Are you sure you want to delete ${employee.name}? This action cannot be undone.`)) {
      const result = await deleteEmployeeAction(employee.id)
      if (result?.message) {
        toast.error(result.message)
      } else {
        toast.success(`${employee.name} deleted successfully!`)
        router.push("/employees")
      }
    }
  }

  if (authLoading || isLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            {authLoading || isLoading ? "Loading employee data..." : "Redirecting, insufficient permissions to edit..."}
          </p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        </main>
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Employee data not available.</p>
          </div>
        </main>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Employees", href: "/employees" },
    { label: employee.name, href: `/employees/${employee.id}` },
    { label: "Edit" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto grid gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Link href={`/employees/${employee.id}`} aria-label="Back to employee profile">
                  <ChevronLeft className="h-6 w-6" />
                </Link>
              </Button>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Edit Employee: {employee.name}</h2>
            </div>
            {isAdmin && ( // Only show delete button for admins
              <Button
                variant="destructive"
                onClick={handleDeleteEmployee}
                className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Employee
              </Button>
            )}
          </div>
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-gray-600 dark:text-gray-400">Update the details and skill levels for {employee.name}.</p>
          {/* Profile Header Card */}
          <Card className="p-6 shadow-md rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={employee.slackProfileImage || "/placeholder.svg?height=64&width=64&query=user+profile+avatar"}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover border-2 border-blue-500 shadow-sm"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">{employee.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {employee.department} &bull; {employee.cityState || "N/A"}, {employee.country || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10" asChild>
                  {employee.linkedinUrl ? (
                    <a
                      href={employee.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="h-5 w-5 text-blue-600" />
                    </a>
                  ) : (
                    <Linkedin className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
          {/* Personal Information Card */}
          <form action={(formData) => handleSaveSection("personal", formData)}>
            <Card className="p-6 shadow-md rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Personal Information
                </CardTitle>
                {isAdmin && !editMode.personal ? (
                  <Button variant="outline" size="default" onClick={() => setEditMode({ ...editMode, personal: true })}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : isAdmin && editMode.personal ? (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditMode({ ...editMode, personal: false })}
                      disabled={personalState?.isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={personalState?.isPending}>
                      {personalState?.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : null}
              </CardHeader>
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <input type="hidden" name="id" value={employee.id} />
                <div className="grid gap-1">
                  <Label htmlFor="firstName" className="text-gray-500 dark:text-gray-400 text-sm">
                    First Name
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input
                      id="firstName"
                      name="firstName"
                      value={employee.firstName || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.firstName || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="lastName" className="text-gray-500 dark:text-gray-400 text-sm">
                    Last Name
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input id="lastName" name="lastName" value={employee.lastName || ""} onChange={handleInputChange} />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.lastName || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email" className="text-gray-500 dark:text-gray-400 text-sm">
                    Email address
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={employee.email || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.email || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone" className="text-gray-500 dark:text-gray-400 text-sm">
                    Phone
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input id="phone" name="phone" value={employee.phone || ""} onChange={handleInputChange} />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.phone || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="department" className="text-gray-500 dark:text-gray-400 text-sm">
                    Department
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input
                      id="department"
                      name="department"
                      value={employee.department || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.department || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="careerExperience" className="text-gray-500 dark:text-gray-400 text-sm">
                    Career Experience
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input
                      id="careerExperience"
                      name="careerExperience"
                      value={employee.careerExperience || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.careerExperience || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="badge" className="text-gray-500 dark:text-gray-400 text-sm">
                    Badge
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input id="badge" name="badge" value={employee.badge || ""} onChange={handleInputChange} />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.badge || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1 col-span-full">
                  <Label htmlFor="bio" className="text-gray-500 dark:text-gray-400 text-sm">
                    Bio
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Textarea id="bio" name="bio" value={employee.bio || ""} onChange={handleInputChange} rows={3} />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.bio || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1 col-span-full">
                  <Label htmlFor="slackProfileImage" className="text-gray-500 dark:text-gray-400 text-sm">
                    Slack Profile Image URL
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input
                      id="slackProfileImage"
                      name="slackProfileImage"
                      value={employee.slackProfileImage || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., https://example.com/my-slack-pic.jpg"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {employee.slackProfileImage || "N/A"}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 col-span-full">
                  <Label htmlFor="slackUrl" className="text-gray-500 dark:text-gray-400 text-sm">
                    Slack Profile URL (Optional)
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input
                      id="slackUrl"
                      name="slackUrl"
                      value={employee.slackUrl || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., https://slack.com/your-profile"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.slackUrl || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1 col-span-full">
                  <Label htmlFor="linkedinUrl" className="text-gray-500 dark:text-gray-400 text-sm">
                    LinkedIn Profile URL (Optional)
                  </Label>
                  {editMode.personal && isAdmin ? (
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={employee.linkedinUrl || ""}
                      onChange={handleInputChange}
                      placeholder="e.g., https://linkedin.com/in/your-profile"
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.linkedinUrl || "N/A"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
          {/* Address Card */}
          <form action={(formData) => handleSaveSection("address", formData)}>
            <Card className="p-6 shadow-md rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between p-0 pb-4">
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Address</CardTitle>
                {isAdmin && !editMode.address ? (
                  <Button variant="outline" size="default" onClick={() => setEditMode({ ...editMode, address: true })}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : isAdmin && editMode.address ? (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditMode({ ...editMode, address: false })}
                      disabled={addressState?.isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={addressState?.isPending}>
                      {addressState?.isPending ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : null}
              </CardHeader>
              <CardContent className="p-0 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <input type="hidden" name="id" value={employee.id} />
                <div className="grid gap-1">
                  <Label htmlFor="country" className="text-gray-500 dark:text-gray-400 text-sm">
                    Country
                  </Label>
                  {editMode.address && isAdmin ? (
                    <Input id="country" name="country" value={employee.country || ""} onChange={handleInputChange} />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.country || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="cityState" className="text-gray-500 dark:text-gray-400 text-sm">
                    City/State
                  </Label>
                  {editMode.address && isAdmin ? (
                    <Input
                      id="cityState"
                      name="cityState"
                      value={employee.cityState || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.cityState || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="postalCode" className="text-gray-500 dark:text-gray-400 text-sm">
                    Postal Code
                  </Label>
                  {editMode.address && isAdmin ? (
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={employee.postalCode || ""}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.postalCode || "N/A"}</p>
                  )}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="taxId" className="text-gray-500 dark:text-gray-400 text-sm">
                    TAX ID
                  </Label>
                  {editMode.address && isAdmin ? (
                    <Input id="taxId" name="taxId" value={employee.taxId || ""} onChange={handleInputChange} />
                  ) : (
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{employee.taxId || "N/A"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
          {/* Skills Section */}
          <h3 className="text-xl font-semibold mt-4 text-gray-800 dark:text-gray-100">Skills</h3>
          {employee.skills.map((category: SkillCategory) => (
            <Card
              key={category.name}
              className="p-4 shadow-sm rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {category.name} (Avg: {category.averageLevel.toFixed(1)})
                </h4>
                {isAdmin && ( // Only show Add Skill button for admins
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentCategoryForNewSkill(category.name)
                      setIsAddSkillDialogOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                )}
              </div>
              <div className="grid gap-3">
                {category.skills.map((skill: Skill) => (
                  <div
                    key={skill.name}
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] items-center gap-2 md:gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`skill-${skill.name}`} className="text-gray-700 dark:text-gray-300">
                        {skill.name}
                      </Label>
                      {skill.url && (
                        <a
                          href={skill.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          <LinkIcon className="h-4 w-4" />
                          <span className="sr-only">View {skill.name} documentation</span>
                        </a>
                      )}
                    </div>
                    <Select
                      value={String(skill.level)}
                      onValueChange={(value) => handleSkillChange(category.name, skill.name, "level", value)}
                      disabled={!isAdmin} // Disable select for non-admins
                    >
                      <SelectTrigger className="w-[100px] border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                        {db.getSkillLevels().map((level) => (
                          <SelectItem
                            key={level}
                            value={String(level)}
                            className="text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id={`skill-url-${skill.name}`}
                      placeholder="Skill URL (Optional)"
                      value={skill.url || ""}
                      onChange={(e) => handleSkillChange(category.name, skill.name, "url", e.target.value)}
                      className="border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                      disabled={!isAdmin} // Disable input for non-admins
                    />
                    {isAdmin && ( // Only show delete skill button for admins
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSkill(category.name, skill.name)}
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                        aria-label={`Delete ${skill.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Add Skill Dialog */}
      {isAdmin && ( // Only show Add Skill Dialog for admins
        <Dialog open={isAddSkillDialogOpen} onOpenChange={setIsAddSkillDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle>Add New Skill to {currentCategoryForNewSkill}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newSkillName" className="text-right">
                  Skill Name
                </Label>
                <Input
                  id="newSkillName"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newSkillLevel" className="text-right">
                  Level
                </Label>
                <Select
                  value={String(newSkillLevel)}
                  onValueChange={(value) => setNewSkillLevel(Number.parseInt(value) as SkillLevel)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {db.getSkillLevels().map((level) => (
                      <SelectItem key={level} value={String(level)}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newSkillUrl" className="text-right">
                  URL (Optional)
                </Label>
                <Input
                  id="newSkillUrl"
                  value={newSkillUrl}
                  onChange={(e) => setNewSkillUrl(e.target.value)}
                  className="col-span-3"
                  placeholder="e.g., https://docs.example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddSkillDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSkill}>Add Skill</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
