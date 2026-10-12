"use client";

import Link from "next/link";
import { useState } from "react";
import { BellOff, CheckCheck, CircleAlert, Info, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn, formatRelative } from "@/lib/utils";
import type { NotificationKind } from "@/types";

const kindIcon: Record<NotificationKind, { icon: typeof Info; className: string; label: string }> = {
  status: { icon: RefreshCcw, className: "bg-info-soft text-info", label: "Status update" },
  reminder: { icon: CircleAlert, className: "bg-warning-soft text-warning", label: "Reminder" },
  system: { icon: Info, className: "bg-muted text-muted-foreground", label: "System" },
};

export function NotificationsList() {
  const { notifications, hydrated, markNotificationRead, markAllNotificationsRead } = useDemoStore();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const unread = notifications.filter((n) => !n.read).length;
  const list = [...notifications]
    .filter((n) => filter === "all" || !n.read)
    .sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Updates about your requests and your account."
        actions={
          <Button
            variant="outline"
            disabled={unread === 0}
            onClick={() => {
              markAllNotificationsRead();
              toast.success("All notifications marked as read");
            }}
          >
            <CheckCheck /> Mark all as read
          </Button>
        }
      />
      <FilterTabs
        label="Filter notifications"
        value={filter}
        onValueChange={setFilter}
        options={[
          { value: "all", label: "All" },
          { value: "unread", label: <>Unread <span className="text-xs text-muted-foreground tabular-nums">{unread}</span></> },
        ]}
      />

      {!hydrated ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title={filter === "unread" ? "You're all caught up" : "No notifications yet"}
          description="We'll let you know here when something changes."
        />
      ) : (
        <Card className="divide-y divide-border overflow-hidden">
          <ul>
            {list.map((n) => {
              const meta = kindIcon[n.kind];
              const body = (
                <>
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", meta.className)}>
                    <meta.icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className={cn("text-sm", n.read ? "font-medium" : "font-semibold")}>{n.title}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">{formatRelative(n.at)}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {meta.label}
                      {!n.read && <span className="sr-only"> · unread</span>}
                    </p>
                  </div>
                  {!n.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-hidden />}
                </>
              );
              const cls = cn(
                "flex w-full gap-4 border-b border-border p-4 text-left transition-colors last:border-0 hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none sm:p-5",
                !n.read && "bg-primary/[0.03]",
              );
              return (
                <li key={n.id}>
                  {n.href ? (
                    <Link href={n.href} className={cls} onClick={() => markNotificationRead(n.id)}>
                      {body}
                    </Link>
                  ) : (
                    <button type="button" className={cn(cls, "cursor-pointer")} onClick={() => markNotificationRead(n.id)}>
                      {body}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
