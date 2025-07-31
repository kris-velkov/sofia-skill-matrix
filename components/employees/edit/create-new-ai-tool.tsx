"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, LucideClockFading } from "lucide-react";
import { toast } from "react-hot-toast";
import { createNewAiTool } from "@/app/actions/employee-ai-tools";
import { AiTool } from "@/types/employees";

interface CreateNewAiToolProps {
  onToolCreated: (tool: AiTool) => void;
  className?: string;
}

export function CreateNewAiTool({
  onToolCreated,
  className = "",
}: CreateNewAiToolProps) {
  const [newToolName, setNewToolName] = useState("");
  const [isCreatingTool, setIsCreatingTool] = useState(false);

  const handleCreateNewTool = async () => {
    if (!newToolName.trim()) {
      toast.error("Please enter a tool name");
      return;
    }

    setIsCreatingTool(true);
    try {
      const createdTool = await createNewAiTool(newToolName.trim());
      onToolCreated(createdTool);
      setNewToolName("");
      toast.success(`AI tool "${createdTool.name}" created successfully!`);
    } catch (error) {
      console.error("Error creating AI tool:", error);
      toast.error("Failed to create AI tool");
    } finally {
      setIsCreatingTool(false);
    }
  };

  return (
    <Card
      className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-1 border-gray-200 ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg font-semibold text-blue-800 flex items-center gap-2">
          <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
          Create New AI Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Input
              type="text"
              placeholder="Enter new AI tool name (e.g., Claude, Kiro, etc.)"
              value={newToolName}
              onChange={(e) => setNewToolName(e.target.value)}
              className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 bg-white/80 placeholder:text-blue-400"
              disabled={isCreatingTool}
            />
            <Button
              onClick={handleCreateNewTool}
              disabled={!newToolName.trim() || isCreatingTool}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 min-w-[120px] justify-center ${
                newToolName.trim() && !isCreatingTool
                  ? "bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              type="button"
            >
              {isCreatingTool ? (
                <>
                  <LucideClockFading className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Create Tool</span>
                  <span className="sm:hidden">Create</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
