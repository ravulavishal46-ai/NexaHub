"use client";

import { CheckCircle2, Gauge, Timer, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { weeklyRequestTrend } from "@/lib/mock/analytics";
import { useDemoStore } from "@/lib/store/demo-store";
import { ActivityChart, ServicePopularityChart, StatusBreakdown } from "./charts/bar-charts";
import { RequestTrendChart } from "./charts/trend-chart";

export function AdminAnalytics() {
  const { requests, hydrated } = useDemoStore();
  const total = requests.length;
  const completed = requests.filter((r) => r.status === "completed");
  const completionRate = total ? Math.round((completed.length / total) * 100) : 0;
  const avgHours = completed.length
    ? Math.round(
        completed.reduce((sum, r) => sum + (new Date(r.updatedAt).getTime() - new Date(r.createdAt).getTime()), 0) /
          completed.length /
          3_600_000,
      )
    : 0;
  const last = weeklyRequestTrend.at(-1)!;
  const prev = weeklyRequestTrend.at(-2)!;
  const weekChange = Math.round(((last.submitted - prev.submitted) / prev.submitted) * 100);

  return (
    <div className="space-y-8">
      <PageHeader title="Analytics" description="Trends and breakdowns across the platform. All data is fictional." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Requests this week" value={last.submitted} icon={TrendingUp} hint={`${weekChange >= 0 ? "+" : ""}${weekChange}% vs previous week`} />
        <StatCard label="Completion rate" value={`${completionRate}%`} icon={CheckCircle2} tone="success" loading={!hydrated} hint="Completed ÷ all requests" />
        <StatCard label="Avg. time to complete" value={`${avgHours}h`} icon={Timer} tone="teal" loading={!hydrated} hint="From submission to completion" />
        <StatCard label="Open workload" value={requests.filter((r) => r.status === "pending" || r.status === "in_progress").length} icon={Gauge} tone="warning" loading={!hydrated} hint="Pending + in progress" />
      </div>
      <RequestTrendChart height={300} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ServicePopularityChart />
        <StatusBreakdown />
      </div>
      <ActivityChart />
    </div>
  );
}
