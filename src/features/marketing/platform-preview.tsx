"use client";

import { Activity, BarChart3, CheckCircle2, ClipboardList, FileClock, Users } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { StatusBadge } from "@/components/shared/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppFrame } from "./app-frame";
import { SectionHeading } from "./section-heading";

const userPoints = [
  "Personal overview with open and completed requests",
  "Guided request form with validation",
  "Status timeline for every request",
  "Notifications when something changes",
];

const adminPoints = [
  "Platform summary and request trends",
  "Service catalog management",
  "Request review, assignment and status updates",
  "Activity log of sensitive actions",
];

function Points({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((p) => (
        <li key={p} className="flex gap-3 text-sm">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

function UserPreview() {
  return (
    <AppFrame label="Dashboard · sample data">
      <div className="space-y-3 p-5" aria-hidden>
        {[
          ["Data Backup Setup", "REQ-1022", "in_progress"],
          ["Electrical Inspection", "REQ-1027", "pending"],
          ["Plumbing Repair", "REQ-1015", "completed"],
        ].map(([name, id, status]) => (
          <div key={id} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ClipboardList className="size-4" />
              </span>
              <div>
                <p className="text-sm font-medium">{name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{id}</p>
              </div>
            </div>
            <StatusBadge status={status as "pending"} />
          </div>
        ))}
      </div>
    </AppFrame>
  );
}

function AdminPreview() {
  const bars = [38, 52, 46, 61, 58, 72, 66, 80, 74, 88, 83, 95];
  return (
    <AppFrame label="Admin console · sample data">
      <div className="p-5" aria-hidden>
        <div className="grid grid-cols-3 gap-3">
          {[
            [Users, "Users", "24"],
            [Activity, "Active", "12"],
            [FileClock, "Logs", "24"],
          ].map(([Icon, label, value]) => {
            const I = Icon as typeof Users;
            return (
              <div key={label as string} className="rounded-lg border border-border p-3">
                <I className="size-4 text-muted-foreground" />
                <p className="mt-2 text-lg font-semibold">{value as string}</p>
                <p className="text-[11px] text-muted-foreground">{label as string}</p>
              </div>
            );
          })}
        </div>
        <div className="mt-4 rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-xs font-medium">
            <BarChart3 className="size-3.5 text-muted-foreground" /> Requests per week
          </div>
          <div className="mt-4 flex h-28 items-end gap-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[4px] bg-chart-1/85"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export function PlatformPreview() {
  return (
    <section aria-labelledby="preview-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="preview-title"
          eyebrow="Platform preview"
          title="Two focused experiences, one platform"
          description="Customers get a simple space to request and track services. Administrators get a separate console to run operations."
        />
        <Reveal className="mt-12">
          <Tabs defaultValue="user" className="flex flex-col items-center">
            <TabsList aria-label="Choose a preview">
              <TabsTrigger value="user">For customers</TabsTrigger>
              <TabsTrigger value="admin">For administrators</TabsTrigger>
            </TabsList>
            {(["user", "admin"] as const).map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-10 w-full">
                <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr]">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {tab === "user" ? "Your requests, always in view" : "Operations at a glance"}
                    </h3>
                    <p className="mt-3 mb-6 text-muted-foreground">
                      {tab === "user"
                        ? "A calm dashboard that answers the question every customer has: what's the status?"
                        : "A dedicated workspace for the team that manages services, people and requests."}
                    </p>
                    <Points items={tab === "user" ? userPoints : adminPoints} />
                  </div>
                  {tab === "user" ? <UserPreview /> : <AdminPreview />}
                </div>
              </TabsContent>
            ))}
          </Tabs>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Previews use fictional sample data for illustration.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
