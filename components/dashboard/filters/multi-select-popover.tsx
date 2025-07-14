"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiSelectPopoverProps {
  label: string;
  id: string;
  selected: string[];
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  getLabel?: (value: string) => string;
}

export function MultiSelectPopover({
  label,
  id,
  selected = [],
  options = [],
  onSelect = () => {},
  placeholder,
  searchPlaceholder,
  getLabel,
}: Readonly<MultiSelectPopoverProps>) {
  let buttonDisplayValue: string;
  if (selected && selected.length === 1) {
    buttonDisplayValue = getLabel ? getLabel(selected[0]) : selected[0];
  } else if (selected && selected.length > 1) {
    buttonDisplayValue = `${selected.length} selected`;
  } else {
    buttonDisplayValue = placeholder ?? `Select ${label}`;
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="text-gray-700">
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between text-gray-800 border-gray-300 hover:bg-gray-100",
              selected &&
                selected.length > 0 &&
                "border-blue-500 ring-2 ring-blue-500"
            )}
            id={id}
          >
            {buttonDisplayValue}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-white border-gray-200 rounded-lg shadow-lg">
          <Command>
            <CommandInput
              placeholder={
                searchPlaceholder ?? `Search ${label.toLowerCase()}...`
              }
              className="border-b border-gray-200"
            />
            <CommandList>
              <CommandEmpty className="py-2 text-center text-gray-500">
                No {label.toLowerCase()} found.
              </CommandEmpty>
              <CommandGroup>
                {options &&
                  options.map((opt) => (
                    <CommandItem
                      key={opt}
                      onSelect={() => onSelect(opt)}
                      className="cursor-pointer flex items-center gap-2 text-gray-800 hover:bg-gray-100"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selected && selected.includes(opt)
                            ? "opacity-100 text-blue-600"
                            : "opacity-0"
                        )}
                      />
                      {getLabel ? getLabel(opt) : opt}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
