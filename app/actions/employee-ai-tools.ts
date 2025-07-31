"use server";

import {
  addEmployeeAiToolInDb,
  deleteEmployeeAiToolInDb,
  updateEmployeeAiToolInDb,
  getEmployeeAiTools as getEmployeeAiToolsFromDb,
  getAllAiTools,
  findOrCreateAiTool,
} from "@/lib/aiToolsDB";
import { EmployeeAiTool } from "@/types/employees";

export async function addEmployeeAiTool(
  employeeId: string,
  aiTool: EmployeeAiTool
) {
  try {
    return await addEmployeeAiToolInDb(aiTool);
  } catch (error) {
    console.error(
      `❌ Failed to add AI tool for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to add AI tool.");
  }
}

export async function deleteEmployeeAiTool(employeeId: string, toolId: string) {
  try {
    return await deleteEmployeeAiToolInDb(employeeId, toolId);
  } catch (error) {
    console.error(
      `Failed to delete AI tool ${toolId} for employee ${employeeId}:`,
      error
    );
    throw new Error("Unable to delete AI tool.");
  }
}

export async function updateEmployeeAiTool(aiTool: EmployeeAiTool) {
  try {
    return await updateEmployeeAiToolInDb(aiTool);
  } catch (error) {
    console.error(`Failed to update AI tool`, error);
    throw new Error("Unable to update AI tool.");
  }
}

export async function getEmployeeAiTools(employeeId: string) {
  try {
    return await getEmployeeAiToolsFromDb(employeeId);
  } catch (error) {
    console.error(`Failed to get AI tools for employee ${employeeId}:`, error);
    throw new Error("Unable to get AI tools.");
  }
}

export async function getAllAvailableAiTools() {
  try {
    return await getAllAiTools();
  } catch (error) {
    console.error("Failed to get available AI tools:", error);
    throw new Error("Unable to get available AI tools.");
  }
}

export async function createNewAiTool(toolName: string) {
  try {
    return await findOrCreateAiTool(toolName);
  } catch (error) {
    console.error("Failed to create AI tool:", error);
    throw new Error("Unable to create AI tool.");
  }
}
