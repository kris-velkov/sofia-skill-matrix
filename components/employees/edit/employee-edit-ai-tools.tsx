"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, LucideClockFading, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  addEmployeeAiTool,
  deleteEmployeeAiTool,
  updateEmployeeAiTool,
} from "@/app/actions/employee-ai-tools";
import {
  EmployeeAiTool,
  AiTool,
  AiToolFrequency,
  SkillLevel,
} from "@/types/employees";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/ui/empty-state";
import { getAllAvailableAiTools } from "@/app/actions/employee-ai-tools";
import { CreateNewAiTool } from "./create-new-ai-tool";
import { FREQUENCY_OPTIONS, PROFICIENCY_LEVELS } from "@/constants/ai-levels";

interface EmployeeEditAiToolsProps {
  employeeId: string;
  aiTools: EmployeeAiTool[];
}

export const EmployeeEditAiTools: React.FC<EmployeeEditAiToolsProps> = ({
  employeeId,
  aiTools: initialAiTools,
}) => {
  const [aiTools, setAiTools] = useState<EmployeeAiTool[]>(initialAiTools);
  const [availableTools, setAvailableTools] = useState<AiTool[]>([]);
  const [newTool, setNewTool] = useState<Partial<EmployeeAiTool>>({
    employeeId: employeeId,
    toolId: "",
    level: 0,
    frequency: "monthly",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingToolId, setUpdatingToolId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableTools = async () => {
      try {
        const tools = await getAllAvailableAiTools();
        setAvailableTools(tools);
      } catch (error) {
        console.error("Failed to fetch available AI tools:", error);
        toast.error("Failed to load available AI tools");
      }
    };

    fetchAvailableTools();
  }, []);

  const handleAddTool = async () => {
    if (newTool.toolId && newTool.level !== undefined && newTool.frequency) {
      setIsSubmitting(true);
      try {
        const toolToAdd = {
          ...newTool,
          employeeId,
        } as EmployeeAiTool;

        await addEmployeeAiTool(employeeId, toolToAdd);

        const selectedTool = availableTools.find(
          (t) => t.id === newTool.toolId
        );
        const newToolWithDetails = {
          ...toolToAdd,
          tool: selectedTool,
        };

        setAiTools((prev) => [...prev, newToolWithDetails]);
        setNewTool({
          employeeId: employeeId,
          toolId: "",
          level: 0,
          frequency: "monthly",
        });
        toast.success("AI tool added!");
      } catch {
        toast.error("Failed to add AI tool");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveTool = async (toolId: string) => {
    const toolToRemove = aiTools.find((t) => t.toolId === toolId);
    if (!toolToRemove) return;

    setIsSubmitting(true);
    try {
      await deleteEmployeeAiTool(employeeId, toolId);
      setAiTools((prev) => prev.filter((t) => t.toolId !== toolId));
      toast.success("AI tool removed!");
    } catch (error) {
      console.error("Error removing AI tool:", error);
      toast.error("Failed to remove AI tool");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToolChange = (
    toolId: string,
    field: keyof EmployeeAiTool,
    value: string | number
  ) => {
    setAiTools((prev) => {
      const updated = prev.map((tool) =>
        tool.toolId === toolId ? { ...tool, [field]: value } : tool
      );
      return updated;
    });
  };

  const handleUpdateSingleTool = async (toolId: string) => {
    setUpdatingToolId(toolId);
    try {
      const toolToUpdate = aiTools.find((t) => t.toolId === toolId);
      if (!toolToUpdate) {
        toast.error("Tool not found");
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tool, ...toolData } = toolToUpdate;

      await updateEmployeeAiTool(toolData);
      toast.success("AI tool updated!");
    } catch (error) {
      console.error("Error updating AI tool:", error);
      toast.error("Failed to update AI tool");
    } finally {
      setUpdatingToolId(null);
    }
  };

  const getAvailableToolsForSelection = () => {
    const usedToolIds = aiTools.map((t) => t.toolId);
    return availableTools.filter((tool) => !usedToolIds.includes(tool.id));
  };

  const handleToolCreated = (createdTool: AiTool) => {
    setAvailableTools((prev) => [...prev, createdTool]);

    setNewTool((prev) => ({ ...prev, toolId: createdTool.id }));
  };

  return (
    <Card className="p-4 md:p-10 shadow-2xl border-0 bg-gradient-to-br from-orange-50/50 via-white to-orange-100/60 rounded-3xl">
      <form>
        <CardHeader className="p-0 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <CardTitle className="text-xl md:text-2xl font-extrabold text-gray-900 flex items-center gap-3 md:gap-4 tracking-tight">
            <Bot className="h-7 w-7 md:h-8 md:w-8 text-gray-500 drop-shadow" />
            <span>Edit AI Tools</span>
          </CardTitle>
        </CardHeader>
        <div className="space-y-8 md:space-y-10">
          <div>
            <div className="space-y-4 md:space-y-6">
              {aiTools.length > 0 ? (
                aiTools.map((tool, index) => (
                  <div
                    key={tool.toolId}
                    className="bg-white/90 px-2 md:px-4 py-3 rounded-2xl border border-gray-200 shadow group transition hover:shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-3">
                      <span className="text-gray-500 font-bold mr-2 text-base md:text-lg">
                        {index + 1}.
                      </span>
                      <span className="flex-1 text-base md:text-lg font-semibold">
                        {tool.tool?.name || "Unknown Tool"}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                      <Select
                        value={tool.level.toString()}
                        onValueChange={(value) =>
                          handleToolChange(
                            tool.toolId,
                            "level",
                            parseInt(value) as SkillLevel
                          )
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFICIENCY_LEVELS.map((level) => (
                            <SelectItem
                              key={level.value}
                              value={level.value.toString()}
                            >
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={tool.frequency}
                        onValueChange={(value) =>
                          handleToolChange(tool.toolId, "frequency", value)
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {FREQUENCY_OPTIONS.map((freq) => (
                            <SelectItem key={freq.value} value={freq.value}>
                              {freq.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-row gap-2 mt-2 sm:mt-0">
                        <Button
                          className="p-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition shadow-none"
                          onClick={() => handleRemoveTool(tool.toolId)}
                          type="button"
                          title="Remove"
                          variant="ghost"
                          size="icon"
                        >
                          {isSubmitting ? (
                            <LucideClockFading className="w-5 h-5 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
                        </Button>
                        <Button
                          className="p-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition shadow-none"
                          onClick={() => handleUpdateSingleTool(tool.toolId)}
                          type="button"
                          title="Save changes"
                          variant="ghost"
                          size="icon"
                          disabled={
                            isSubmitting || updatingToolId === tool.toolId
                          }
                        >
                          {updatingToolId === tool.toolId ? (
                            <LucideClockFading className="w-5 h-5 animate-spin text-green-600" />
                          ) : (
                            <Save className="w-5 h-5 text-blue-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  className="text-gray-600"
                  icon={<Bot className="w-7 h-7 mb-2" />}
                  message="No AI tools listed for this employee. Add one below."
                />
              )}
            </div>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-green-800 mb-2">
              Add New AI Tool
            </h3>
            <div className="px-2 md:px-4 bg-white py-3 rounded-xl border-2 border-gray-200">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <Select
                    value={newTool.toolId || ""}
                    onValueChange={(value) =>
                      setNewTool((prev) => ({ ...prev, toolId: value }))
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select AI Tool *" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableToolsForSelection().map((tool) => (
                        <SelectItem key={tool.id} value={tool.id}>
                          {tool.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newTool.level?.toString() || "0"}
                    onValueChange={(value) =>
                      setNewTool((prev) => ({
                        ...prev,
                        level: parseInt(value) as SkillLevel,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFICIENCY_LEVELS.map((level) => (
                        <SelectItem
                          key={level.value}
                          value={level.value.toString()}
                        >
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newTool.frequency || "monthly"}
                    onValueChange={(value) =>
                      setNewTool((prev) => ({
                        ...prev,
                        frequency: value as AiToolFrequency,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {FREQUENCY_OPTIONS.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    className={`p-2 rounded-full flex items-center justify-center transition shadow-none cursor-pointer ${
                      newTool.toolId && !isSubmitting
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleAddTool}
                    type="button"
                    disabled={!newTool.toolId || isSubmitting}
                    title="Add"
                    variant="ghost"
                    size="icon"
                  >
                    {isSubmitting ? (
                      <LucideClockFading className="w-5 h-5 animate-spin text-green-600" />
                    ) : (
                      <Plus className="w-5 h-5 cursor-pointer" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <CreateNewAiTool onToolCreated={handleToolCreated} />
        </div>
      </form>
    </Card>
  );
};

export default EmployeeEditAiTools;
