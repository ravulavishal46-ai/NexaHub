"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FilterTabsProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: { value: T; label: ReactNode }[];
  label: string;
  className?: string;
}

/**
 * Looks like tabs, behaves like a filter: a group of toggle buttons.
 * (Real tabs imply separate panels; filters only narrow one list.)
 */
export function FilterTabs<T extends string>({ value, onValueChange, options, label, className }: FilterTabsProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "scrollbar-thin inline-flex h-10 max-w-full items-center gap-1 overflow-x-auto rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={active}
            onClick={() => onValueChange(opt.value)}
            className={cn(
              "inline-flex h-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-all outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40",
              active && "bg-card text-foreground shadow-sm",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
