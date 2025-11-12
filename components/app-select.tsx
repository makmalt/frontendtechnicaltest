"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type SelectWithAddProps = {
  value?: string;
  options: Option[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  onAdd?: () => void;
  className?: string;
};

export function AppSelect({
  value,
  options,
  placeholder = "Select option",
  onValueChange,
  onAdd,
  className,
}: SelectWithAddProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}

        {/* Tombol Tambah Menu */}
        <div className="border-t border-border mt-1 pt-1">
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-center text-sm"
            onClick={() => {
              if (onAdd) onAdd();
            }}
          >
            <Plus className="h-4 w-4 mr-1" /> Tambah Menu
          </Button>
        </div>
      </SelectContent>
    </Select>
  );
}
