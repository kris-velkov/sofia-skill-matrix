import { EMPLOYEES_DATA, COMPETENCY_LEVELS, calculateAverageLevel } from "./employees-data"
import type { Employee, Skill, SkillLevel } from "./types"

// In-memory "database" for demonstration purposes
let employees: Employee[] = JSON.parse(JSON.stringify(EMPLOYEES_DATA))

export async function getEmployees(): Promise<Employee[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return JSON.parse(JSON.stringify(employees)) // Return a deep copy to prevent direct mutation
}

export async function getEmployeeById(id: string): Promise<Employee | undefined> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  const employee = employees.find((emp) => emp.id === id)
  return employee ? JSON.parse(JSON.stringify(employee)) : undefined // Return a deep copy
}

export async function addEmployee(newEmployee: Employee): Promise<Employee> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  const employeeWithCalculatedSkills = {
    ...newEmployee,
    skills: newEmployee.skills.map((category) => ({
      ...category,
      averageLevel: calculateAverageLevel(category.skills),
    })),
  }
  employees.push(employeeWithCalculatedSkills)
  return JSON.parse(JSON.stringify(employeeWithCalculatedSkills))
}

export async function updateEmployee(updatedEmployee: Employee): Promise<Employee | undefined> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  const index = employees.findIndex((emp) => emp.id === updatedEmployee.id)
  if (index > -1) {
    const employeeWithCalculatedSkills = {
      ...updatedEmployee,
      skills: updatedEmployee.skills.map((category) => ({
        ...category,
        averageLevel: calculateAverageLevel(category.skills),
      })),
    }
    employees[index] = employeeWithCalculatedSkills
    return JSON.parse(JSON.stringify(employeeWithCalculatedSkills))
  }
  return undefined
}

export async function deleteEmployee(id: string): Promise<boolean> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  const initialLength = employees.length
  employees = employees.filter((emp) => emp.id !== id)
  return employees.length < initialLength
}

export function getCompetencyLevels() {
  return COMPETENCY_LEVELS
}

export function getSkillLevels() {
  return [0, 1, 2, 3, 4] as SkillLevel[]
}

export function calculateSkillCategoryAverage(skills: Skill[]): number {
  return calculateAverageLevel(skills)
}

// Consolidated helper so callers can do  `import { db } from "@/lib/db"`
export const db = {
  getEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
}
