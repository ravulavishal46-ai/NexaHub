"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, CheckCircle2, ClipboardList, Clock3, Loader, Plus } from "lucide-react";
import { ServiceIcon } from "@/components/shared/service-icon";
import { StatCard } from "@/components/shared/stat-card";
import { statusMeta } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestsTable } from "@/features/requests/requests-table";
import { useServiceLookup } from "@/features/requests/use-service-lookup";
import { useDemoStore, useMyRequests } from "@/lib/store/demo-store";
import { cn, formatRelative } from "@/lib/utils";

export function DashboardOverview() {
  const { currentUser, services, hydrated } = useDemoStore();
  const mine = useMyRequests();
  const getService = useServiceLookup();
  const firstName = currentUser.name.split(" ")[0];

  const counts = {
    total: mine.length,
    pending: mine.filter((r) => r.status === "pending").length,
    inProgress: mine.filter((r) => r.status === "in_progress").length,
    completed: mine.filter((r) => r.status === "completed").length,
  };

  const activity = useMemo(
    () =>
      mine
        .flatMap((r) => r.timeline.map((e) => ({ ...e, requestId: r.id, serviceId: r.serviceId })))
        .sort((a, b) => b.at.localeCompare(a.at))
        .slice(0, 6),
    [mine],
  );

  const recommended = useMemo(() => {
    const used = new Set(mine.map((r) => r.serviceId));
    return services
      .filter((s) => s.isActive && !used.has(s.id))
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
      .slice(0, 3);
  }, [services, mine]);

  const active = mine.filter((r) => r.status === "pending" || r.status === "in_progress").slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Overview</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back{hydrated ? `, ${firstName}` : ""}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Here&apos;s what&apos;s happening with your service requests.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/services">Browse services</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/requests/new">
              <Plus /> New request
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total requests" value={counts.total} icon={ClipboardList} loading={!hydrated} hint="All time" />
        <StatCard label="Pending" value={counts.pending} icon={Clock3} tone="warning" loading={!hydrated} hint="Awaiting review" />
        <StatCard label="In progress" value={counts.inProgress} icon={Loader} tone="brand" loading={!hydrated} hint="Being worked on" />
        <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} tone="success" loading={!hydrated} hint="Finished requests" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Active requests</CardTitle>
              <CardDescription>Pending and in-progress requests</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/requests">
                View all <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          {hydrated && active.length === 0 ? (
            <CardContent>
              <EmptyState
                icon={ClipboardList}
                title="No active requests"
                description="When you submit a request, you'll be able to track it here."
                action={
                  <Button asChild size="sm">
                    <Link href="/dashboard/requests/new">Create a request</Link>
                  </Button>
                }
              />
            </CardContent>
          ) : (
            <div className="border-t border-border">
              <RequestsTable
                requests={active}
                caption="Active requests"
                loading={!hydrated}
                detailsHref={(r) => `/dashboard/requests/${r.id}`}
              />
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest updates across your requests</CardDescription>
          </CardHeader>
          <CardContent>
            {!hydrated ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : activity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              <ul className="space-y-4">
                {activity.map((a, i) => {
                  const meta = statusMeta[a.status];
                  const Icon = meta.icon;
                  return (
                    <li key={`${a.requestId}-${i}`} className="flex gap-3">
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg",
                          {
                            warning: "bg-warning-soft text-warning",
                            info: "bg-info-soft text-info",
                            success: "bg-success-soft text-success",
                            neutral: "bg-neutral-soft text-neutral",
                          }[meta.variant],
                        )}
                      >
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">
                          <Link href={`/dashboard/requests/${a.requestId}`} className="font-medium hover:underline">
                            {getService(a.serviceId)?.name}
                          </Link>{" "}
                          <span className="text-muted-foreground">· {meta.label.toLowerCase()}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {a.requestId} · {formatRelative(a.at)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="recommended-title">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="recommended-title" className="text-lg font-semibold">
            Recommended for you
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/services">
              Browse all <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {recommended.map((s) => (
            <Card key={s.id} className="flex-row items-start gap-4 p-5">
              <ServiceIcon icon={s.icon} category={s.categoryId} />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{s.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{s.shortDescription}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{s.pricing.label}</span>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/dashboard/requests/new?service=${s.slug}`}>
                      Request <span className="sr-only">{s.name}</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
