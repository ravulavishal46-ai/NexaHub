import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A neutral "app window" frame used for illustrative product previews. */
export function AppFrame({
  children,
  className,
  label = "app.nexahub.example",
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-navy/10 ring-1 ring-navy/[0.03] dark:shadow-black/40",
        className,
      )}
    >
      <div className="flex h-10 items-center gap-2 border-b border-border bg-muted/50 px-4">
        <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span className="size-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
        <span className="mx-auto hidden rounded-md bg-card px-3 py-0.5 font-mono text-[11px] text-muted-foreground ring-1 ring-border sm:block">
          {label}
        </span>
      </div>
      {children}
    </div>
  );
}
