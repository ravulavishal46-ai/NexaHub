import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  loading,
  tone = "brand",
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  loading?: boolean;
  tone?: "brand" | "teal" | "warning" | "success";
}) {
  const tones = {
    brand: "bg-primary/10 text-primary",
    teal: "bg-teal/10 text-teal dark:text-teal-300",
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className={cn("flex size-9 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="size-[18px]" aria-hidden />
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-8 w-16" />
      ) : (
        <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      )}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </Card>
  );
}
