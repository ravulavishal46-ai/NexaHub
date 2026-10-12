import { CheckCircle2, CircleDashed, Clock3, Loader, XCircle, ArrowDown, ArrowUp, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { AccountStatus, RequestPriority, RequestStatus } from "@/types";

export const statusMeta: Record<
  RequestStatus,
  { label: string; variant: "warning" | "info" | "success" | "neutral"; icon: typeof Clock3 }
> = {
  pending: { label: "Pending", variant: "warning", icon: Clock3 },
  in_progress: { label: "In progress", variant: "info", icon: Loader },
  completed: { label: "Completed", variant: "success", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", variant: "neutral", icon: XCircle },
};

/** Status is always shown as icon + text, never by color alone. */
export function StatusBadge({ status }: { status: RequestStatus }) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <Badge variant={meta.variant}>
      <Icon aria-hidden />
      {meta.label}
    </Badge>
  );
}

const priorityMeta: Record<RequestPriority, { label: string; icon: typeof ArrowUp; className: string }> = {
  high: { label: "High", icon: ArrowUp, className: "text-danger" },
  normal: { label: "Normal", icon: Minus, className: "text-muted-foreground" },
  low: { label: "Low", icon: ArrowDown, className: "text-muted-foreground" },
};

export function PriorityLabel({ priority }: { priority: RequestPriority }) {
  const meta = priorityMeta[priority];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${meta.className}`}>
      <Icon className="size-3.5" aria-hidden />
      {meta.label}
    </span>
  );
}

const accountMeta: Record<AccountStatus, { label: string; variant: "success" | "danger" | "muted"; icon: typeof Clock3 }> = {
  active: { label: "Active", variant: "success", icon: CheckCircle2 },
  suspended: { label: "Suspended", variant: "danger", icon: XCircle },
  invited: { label: "Invited", variant: "muted", icon: CircleDashed },
};

export function AccountStatusBadge({ status }: { status: AccountStatus }) {
  const meta = accountMeta[status];
  const Icon = meta.icon;
  return (
    <Badge variant={meta.variant}>
      <Icon aria-hidden />
      {meta.label}
    </Badge>
  );
}
