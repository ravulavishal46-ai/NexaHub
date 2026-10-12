"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, CheckCircle2, ClipboardList, Package, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestsTable } from "@/features/requests/requests-table";
import { useDemoStore } from "@/lib/store/demo-store";
import { formatRelative } from "@/lib/utils";
import { RequestTrendChart } from "./charts/trend-chart";
import { categoryLabel } from "./activity-meta";

export function AdminOverview() {
  const { users, services, requests, activity, hydrated } = useDemoStore();
  const userName = useMemo(() => new Map(users.map((u) => [u.id, u.name])), [users]);

  const activeRequests = requests.filter((r) => r.status === "pending" || r.status === "in_progress").length;
  const completed = requests.filter((r) => r.status === "completed").length;
  const recentRequests = [...requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const recentActivity = [...activity].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 6);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin overview"
        description="A snapshot of platform activity. All figures come from fictional demo data."
        actions={
          <Button asChild>
            <Link href="/admin/requests">
              Review requests <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={users.length} icon={Users} loading={!hydrated} hint={`${users.filter((u) => u.status === "active").length} active accounts`} />
        <StatCard label="Total services" value={services.length} icon={Package} tone="teal" loading={!hydrated} hint={`${services.filter((s) => s.isActive).length} currently active`} />
        <StatCard label="Active requests" value={activeRequests} icon={ClipboardList} tone="warning" loading={!hydrated} hint="Pending or in progress" />
        <StatCard label="Completed requests" value={completed} icon={CheckCircle2} tone="success" loading={!hydrated} hint="All time" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <RequestTrendChart />
        <Card>
          <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
            <div>
              <CardTitle>Recent user activity</CardTitle>
              <CardDescription className="mt-1">Latest events across the platform</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/activity">
                All <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <Avatar name={a.actor} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{a.actor}</span>{" "}
                      <span className="text-muted-foreground">{a.action.charAt(0).toLowerCase() + a.action.slice(1)}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="px-1.5 py-0 text-[10px]">
                        {categoryLabel[a.category]}
                      </Badge>
                      <span className="truncate">{a.target}</span>
                      <span>· {formatRelative(a.at)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>Recent service requests</CardTitle>
            <CardDescription className="mt-1">The five most recently submitted requests</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/requests">
              Manage <ArrowRight />
            </Link>
          </Button>
        </CardHeader>
        <div className="border-t border-border">
          <RequestsTable
            requests={recentRequests}
            caption="Recent service requests"
            loading={!hydrated}
            showPriority
            extraColumn={{ header: "Customer", cell: (r) => userName.get(r.userId) ?? "Unknown" }}
            detailsHref={(r) => `/admin/requests?open=${r.id}`}
          />
        </div>
      </Card>
    </div>
  );
}
