"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { weeklyRequestTrend } from "@/lib/mock/analytics";
import { ChartCard, Legend } from "./chart-card";
import { ChartTooltip } from "./chart-tooltip";

const axis = { fontSize: 11, fill: "var(--muted-foreground)" };

/** Two series on one shared axis: submitted vs completed requests per week. */
export function RequestTrendChart({ className, height = 260 }: { className?: string; height?: number }) {
  return (
    <ChartCard
      className={className}
      title="Request trend"
      description="Weekly submitted vs completed requests (demo data)"
      legend={
        <Legend
          items={[
            { label: "Submitted", color: "var(--chart-1)" },
            { label: "Completed", color: "var(--chart-2)" },
          ]}
        />
      }
      table={{
        columns: ["Week of", "Submitted", "Completed"],
        rows: weeklyRequestTrend.map((d) => [d.week, d.submitted, d.completed]),
      }}
    >
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weeklyRequestTrend} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis dataKey="week" tick={axis} tickLine={false} axisLine={{ stroke: "var(--chart-grid)" }} interval="preserveStartEnd" minTickGap={24} />
            <YAxis tick={axis} tickLine={false} axisLine={false} allowDecimals={false} width={44} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--chart-axis)", strokeDasharray: "3 3" }} />
            <Line type="monotone" dataKey="submitted" name="Submitted" stroke="var(--chart-1)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} />
            <Line type="monotone" dataKey="completed" name="Completed" stroke="var(--chart-2)" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
