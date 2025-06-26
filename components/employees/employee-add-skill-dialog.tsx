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
  setNewSkillUrl: (url: string) => void;
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
  newSkillUrl,
  setNewSkillUrl,
  onAddSkill,
}: Readonly<EmployeeAddSkillDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[430px] bg-white rounded-2xl shadow-2xl border-0 p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Add Skill to{" "}
            <span className="text-blue-600">{currentCategory}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="border-b border-gray-200 mx-6" />
        <div className="grid gap-6 py-6 px-6 bg-gray-50 rounded-b-2xl">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="newSkillName"
              className="text-right font-semibold text-gray-700"
            >
              Skill Name
            </Label>
            <Input
              id="newSkillName"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="col-span-3 bg-white rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-lg px-4 py-2"
              required
              autoFocus
              maxLength={32}
              placeholder="e.g. React, Node.js"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="newSkillLevel"
              className="text-right font-semibold text-gray-700"
            >
              Level
            </Label>
            <Select
              value={String(newSkillLevel)}
              onValueChange={(value) =>
                setNewSkillLevel(Number.parseInt(value) as SkillLevel)
              }
            >
              <SelectTrigger className="col-span-3 bg-white rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-lg px-4 py-2">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                {getSkillLevels().map((level) => (
                  <SelectItem key={level} value={String(level)}>
                    <span className="font-semibold text-blue-700">{level}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="newSkillUrl"
              className="text-right font-semibold text-gray-700"
            >
              Skill URL
            </Label>
            <Input
              id="newSkillUrl"
              value={newSkillUrl}
              onChange={(e) => setNewSkillUrl(e.target.value)}
              className="col-span-3 bg-white rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition text-lg px-4 py-2"
              placeholder="Optional: https://..."
              maxLength={128}
            />
          </div>
        </div>
        <DialogFooter className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border-gray-300 hover:bg-gray-100 transition font-semibold"
          >
            Cancel
          </Button>
          <Button
            onClick={onAddSkill}
            className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow px-6 py-2 text-lg"
          >
            Add Skill
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
