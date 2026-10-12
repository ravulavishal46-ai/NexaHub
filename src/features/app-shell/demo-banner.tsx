import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

/** A slim, honest notice that this area is a prototype. */
export function DemoBanner({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warning" }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-center gap-2.5 border-b px-4 py-2 text-xs sm:px-6",
        tone === "info" ? "border-info/15 bg-info-soft text-info" : "border-warning/20 bg-warning-soft text-warning",
      )}
    >
      <FlaskConical className="size-3.5 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
