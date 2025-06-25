import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SkillLevel } from "@/lib/types";
import { getSkillLevels } from "@/lib/skillLevels";
import React from "react";

interface EmployeeAddSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCategory: string | null;
  newSkillName: string;
  setNewSkillName: (name: string) => void;
  newSkillLevel: SkillLevel;
  setNewSkillLevel: (level: SkillLevel) => void;
  newSkillUrl: string;
  onAddSkill: () => void;
}

export function EmployeeAddSkillDialog({
  open,
  onOpenChange,
  currentCategory,
  newSkillName,
  setNewSkillName,
  newSkillLevel,
  setNewSkillLevel,
  onAddSkill,
}: EmployeeAddSkillDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Add New Skill to {currentCategory}</DialogTitle>
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
              onValueChange={(value) =>
                setNewSkillLevel(Number.parseInt(value) as SkillLevel)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                {getSkillLevels().map((level) => (
                  <SelectItem key={level} value={String(level)}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onAddSkill}>Add Skill</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
