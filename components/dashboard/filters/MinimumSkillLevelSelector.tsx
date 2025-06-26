import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SkillLevel } from "@/lib/types";

interface MinimumSkillLevelSelectorProps {
  value: SkillLevel | null;
  onChange: (level: SkillLevel | null) => void;
}

export function MinimumSkillLevelSelector({
  value,
  onChange,
}: Readonly<MinimumSkillLevelSelectorProps>) {
  return (
    <div className="grid gap-2">
      <Label className="text-gray-700">Minimum Skill Level</Label>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((level) => (
          <Button
            key={level}
            variant={value === level ? "default" : "outline"}
            onClick={() =>
              onChange(value === level ? null : (level as SkillLevel))
            }
            className={cn(
              "w-10 h-10 rounded-lg",
              value === level
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
            )}
          >
            {level}
          </Button>
        ))}
      </div>
    </div>
  );
}
