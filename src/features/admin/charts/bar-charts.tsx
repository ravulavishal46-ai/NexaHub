"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { statusMeta } from "@/components/shared/status-badge";
import { dailyActiveUsers } from "@/lib/mock/analytics";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn } from "@/lib/utils";
import type { RequestStatus } from "@/types";
import { ChartCard } from "./chart-card";
import { ChartTooltip } from "./chart-tooltip";

const axis = { fontSize: 11, fill: "var(--muted-foreground)" };

/** Horizontal bars: number of requests per service (computed from demo data). */
export function ServicePopularityChart({ className }: { className?: string }) {
  const { requests, services } = useDemoStore();
  const data = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of requests) counts.set(r.serviceId, (counts.get(r.serviceId) ?? 0) + 1);
    return services
      .map((s) => ({ name: s.name, requests: counts.get(s.id) ?? 0 }))
      .filter((d) => d.requests > 0)
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 7);
  }, [requests, services]);

  return (
    <ChartCard
      className={className}
      title="Service popularity"
      description="Requests per service, top 7"
      table={{ columns: ["Service", "Requests"], rows: data.map((d) => [d.name, d.requests]) }}
    >
      <div style={{ height: Math.max(200, data.length * 38) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 28, bottom: 0, left: 0 }} barCategoryGap={8}>
            <XAxis type="number" hide allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={axis} tickLine={false} axisLine={false} width={150} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.6 }} />
            <Bar dataKey="requests" name="Requests" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={20}>
              <LabelList dataKey="requests" position="right" fontSize={11} fill="var(--muted-foreground)" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

/** Vertical bars: fictional daily active users this week (single series). */
export function ActivityChart({ className }: { className?: string }) {
  return (
    <ChartCard
      className={className}
      title="Daily active users"
      description="Sign-ins per day this week (demo data)"
      table={{ columns: ["Day", "Active users"], rows: dailyActiveUsers.map((d) => [d.day, d.users]) }}
    >
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyActiveUsers} margin={{ top: 16, right: 4, bottom: 0, left: -18 }}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis dataKey="day" tick={axis} tickLine={false} axisLine={{ stroke: "var(--chart-grid)" }} />
            <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.6 }} />
            <Bar dataKey="users" name="Active users" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

const statusBar: Record<RequestStatus, string> = {
  pending: "bg-warning",
  in_progress: "bg-info",
  completed: "bg-success",
  cancelled: "bg-neutral",
};

/** Status breakdown as labelled meters (icon + label + value, never color alone). */
export function StatusBreakdown({ className }: { className?: string }) {
  const { requests } = useDemoStore();
  const total = requests.length || 1;
  const rows = (Object.keys(statusMeta) as RequestStatus[]).map((s) => ({
    status: s,
    count: requests.filter((r) => r.status === s).length,
  }));
  return (
    <ChartCard
      className={className}
      readableContent
      title="Requests by status"
      description={`${requests.length} requests in total`}
      table={{
        columns: ["Status", "Requests", "Share"],
        rows: rows.map((r) => [statusMeta[r.status].label, r.count, `${Math.round((r.count / total) * 100)}%`]),
      }}
    >
      <ul className="space-y-4 py-1">
        {rows.map((r) => {
          const meta = statusMeta[r.status];
          const pct = Math.round((r.count / total) * 100);
          return (
            <li key={r.status}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <meta.icon className="size-3.5 text-muted-foreground" aria-hidden />
                  {meta.label}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  <span className="font-medium text-foreground">{r.count}</span> · {pct}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", statusBar[r.status])} style={{ width: `${pct}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}
