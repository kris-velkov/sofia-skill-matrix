import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";

interface SelectFilterProps<T extends string> {
  label: string;
  id: string;
  value: T | null;
  options?: T[];
  onChange: (value: T | null) => void;
  placeholder?: string;
  showAll?: boolean;
  allLabel?: string;
  className?: string;
}

export function SelectFilter<T extends string>({
  label,
  id,
  value,
  options = [],
  onChange,
  placeholder,
  showAll = true,
  allLabel = "All",
  className,
}: Readonly<SelectFilterProps<T>>) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-gray-700">
        {label}
      </Label>
      <Select
        value={value ?? (showAll ? "all" : options[0] ?? "all")}
        onValueChange={(val) => onChange(val === "all" ? null : (val as T))}
      >
        <SelectTrigger
          id={id}
          className={cn(
            "text-gray-800 border-gray-300 hover:bg-gray-100",
            value && value !== "all" && "border-blue-500 ring-2 ring-blue-500",
            className
          )}
        >
          <SelectValue placeholder={placeholder ?? `Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200 rounded-lg shadow-lg">
          {showAll && (
            <SelectItem value="all" className="text-gray-800 hover:bg-gray-100">
              {allLabel}
            </SelectItem>
          )}
          {options &&
            options.length > 0 &&
            options.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className="text-gray-800 hover:bg-gray-100"
              >
                {opt}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
