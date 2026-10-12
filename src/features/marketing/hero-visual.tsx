"use client";

import { motion } from "motion/react";
import { Bell, CheckCircle2, ClipboardList, Clock3, LayoutDashboard, Search, Settings, Sparkles } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import type { RequestStatus } from "@/types";
import { AppFrame } from "./app-frame";

const rows: { id: string; service: string; date: string; status: RequestStatus }[] = [
  { id: "REQ-1031", service: "Website Audit", date: "Oct 10", status: "pending" },
  { id: "REQ-1027", service: "Electrical Inspection", date: "Oct 7", status: "pending" },
  { id: "REQ-1022", service: "Data Backup Setup", date: "Oct 1", status: "in_progress" },
  { id: "REQ-1015", service: "Plumbing Repair", date: "Sep 18", status: "completed" },
];

const timeline = [
  { label: "Request submitted", time: "Oct 1 · 13:20", done: true },
  { label: "Assigned to technician", time: "Oct 2 · 09:15", done: true },
  { label: "Work in progress", time: "Oct 2 · 09:30", done: true, current: true },
  { label: "Completed", time: "Pending", done: false },
];

/**
 * Illustrative product preview built from real UI pieces (not a screenshot).
 * Hidden from screen readers; the caption below describes it.
 */
export function HeroVisual() {
  return (
    <div className="relative mx-auto max-w-5xl" aria-hidden>
      <div className="absolute -inset-x-10 -top-10 -bottom-6 -z-10 rounded-[3rem] bg-gradient-to-b from-primary/10 via-teal/5 to-transparent blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.21, 0.6, 0.35, 1] }}
      >
        <AppFrame>
          <div className="grid min-h-[340px] grid-cols-1 md:grid-cols-[180px_1fr] lg:grid-cols-[180px_1fr_260px]">
            {/* Sidebar */}
            <div className="hidden border-r border-border bg-sidebar p-3 md:block">
              <div className="mb-4 flex items-center gap-2 px-2 pt-1">
                <span className="size-5 rounded-md bg-navy dark:bg-white" />
                <span className="text-xs font-semibold">NexaHub</span>
              </div>
              {[
                [LayoutDashboard, "Overview", false],
                [Search, "Browse", false],
                [ClipboardList, "My requests", true],
                [Bell, "Notifications", false],
                [Settings, "Settings", false],
              ].map(([Icon, label, active]) => {
                const I = Icon as typeof Bell;
                return (
                  <div
                    key={label as string}
                    className={`mb-0.5 flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${active ? "bg-sidebar-accent font-medium text-foreground" : "text-muted-foreground"}`}
                  >
                    <I className="size-3.5" />
                    {label as string}
                  </div>
                );
              })}
            </div>

            {/* Main */}
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted-foreground">Good morning, Alex</p>
                  <p className="text-sm font-semibold">My requests</p>
                </div>
                <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                  + New request
                </span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {[
                  ["Total", "7", ClipboardList],
                  ["Pending", "2", Clock3],
                  ["Completed", "3", CheckCircle2],
                ].map(([label, value, Icon]) => {
                  const I = Icon as typeof Bell;
                  return (
                    <div key={label as string} className="rounded-lg border border-border p-2.5">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        {label as string}
                        <I className="size-3" />
                      </div>
                      <p className="mt-1 text-lg font-semibold">{value as string}</p>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                {rows.map((row, i) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + i * 0.08 }}
                    className={`flex items-center justify-between gap-3 px-3 py-2.5 text-xs ${i ? "border-t border-border" : ""} ${row.id === "REQ-1022" ? "bg-primary/[0.04]" : ""}`}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">{row.service}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        {row.id} · {row.date}
                      </p>
                    </div>
                    <div className="origin-right scale-90">
                      <StatusBadge status={row.status} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Detail panel */}
            <div className="hidden border-l border-border bg-muted/30 p-5 lg:block">
              <p className="font-mono text-[10px] text-muted-foreground">REQ-1022</p>
              <p className="text-sm font-semibold">Data Backup Setup</p>
              <div className="mt-1.5 origin-left scale-90">
                <StatusBadge status="in_progress" />
              </div>
              <ol className="mt-5 space-y-4">
                {timeline.map((step) => (
                  <li key={step.label} className="flex gap-3">
                    <span
                      className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border ${step.done ? "border-primary bg-primary text-white" : "border-border bg-card"} ${step.current ? "ring-4 ring-primary/15" : ""}`}
                    >
                      {step.done && <CheckCircle2 className="size-3" />}
                    </span>
                    <div>
                      <p className={`text-xs ${step.done ? "font-medium" : "text-muted-foreground"}`}>{step.label}</p>
                      <p className="text-[10px] text-muted-foreground">{step.time}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </AppFrame>
      </motion.div>

      {/* Floating notifications */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        className="absolute -bottom-6 -left-2 hidden w-64 rounded-xl border border-border bg-card p-3 shadow-xl shadow-navy/10 sm:block lg:-left-10"
      >
        <div className="flex gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success-soft text-success">
            <CheckCircle2 className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">Request submitted</p>
            <p className="text-[11px] text-muted-foreground">REQ-1031 · Website Audit</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute -top-5 -right-2 hidden w-60 rounded-xl border border-border bg-card p-3 shadow-xl shadow-navy/10 md:block lg:-right-10"
      >
        <div className="flex gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
            <Sparkles className="size-4" />
          </span>
          <div>
            <p className="text-xs font-semibold">Status updated</p>
            <p className="text-[11px] text-muted-foreground">Backup setup is now in progress</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
