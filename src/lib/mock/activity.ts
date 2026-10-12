import type { ActivityLog, AppNotification } from "@/types";

/** FICTIONAL notifications for the demo user. */
export const notifications: AppNotification[] = [
  {
    id: "ntf-1",
    kind: "status",
    title: "Request REQ-1022 is in progress",
    body: "Jordan Lee has started setting up your backups.",
    at: "2026-10-02T09:30:00Z",
    read: false,
    href: "/dashboard/requests/REQ-1022",
  },
  {
    id: "ntf-2",
    kind: "reminder",
    title: "Confirm your inspection time",
    body: "Your Electrical Inspection request is waiting for review.",
    at: "2026-10-08T08:00:00Z",
    read: false,
    href: "/dashboard/requests/REQ-1027",
  },
  {
    id: "ntf-3",
    kind: "status",
    title: "Request REQ-1015 completed",
    body: "Plumbing Repair was marked complete. It is now in your history.",
    at: "2026-09-21T10:30:00Z",
    read: true,
    href: "/dashboard/requests/REQ-1015",
  },
  {
    id: "ntf-4",
    kind: "system",
    title: "Welcome to the NexaHub prototype",
    body: "Everything here uses demo data stored only in your browser.",
    at: "2026-08-01T09:00:00Z",
    read: true,
  },
];

const entries: [string, string, ActivityLog["category"], string, string][] = [
  ["Priya Raman", "Updated request status to In progress", "request", "REQ-1030", "2026-10-11T16:20:00Z"],
  ["Priya Raman", "Assigned request to Bea Thompson", "request", "REQ-1030", "2026-10-11T16:18:00Z"],
  ["Mateo Alvarez", "Signed in", "auth", "Session", "2026-10-11T15:02:00Z"],
  ["Priya Raman", "Deactivated service", "service", "Career Coaching Session", "2026-10-11T11:45:00Z"],
  ["Kwame Mensah", "Submitted a new request", "request", "REQ-1032", "2026-10-11T12:05:00Z"],
  ["Priya Raman", "Updated pricing label", "service", "Website Audit", "2026-10-10T17:30:00Z"],
  ["Alex Morgan", "Submitted a new request", "request", "REQ-1031", "2026-10-10T16:45:00Z"],
  ["Priya Raman", "Suspended account", "user", "Oliver Grant", "2026-10-10T10:12:00Z"],
  ["Ravi Menon", "Submitted a new request", "request", "REQ-1029", "2026-10-09T11:30:00Z"],
  ["Priya Raman", "Updated notification settings", "settings", "Platform settings", "2026-10-09T09:00:00Z"],
  ["Tomás Duarte", "Signed in", "auth", "Session", "2026-10-09T08:41:00Z"],
  ["Priya Raman", "Marked request as Completed", "request", "REQ-1019", "2026-10-08T18:05:00Z"],
  ["Grace Whitfield", "Updated profile details", "user", "Grace Whitfield", "2026-10-08T14:22:00Z"],
  ["Priya Raman", "Created service", "service", "Data Backup Setup", "2026-10-07T13:10:00Z"],
  ["Alex Morgan", "Submitted a new request", "request", "REQ-1027", "2026-10-07T11:00:00Z"],
  ["Priya Raman", "Invited user", "user", "Elena Petrova", "2026-10-06T10:30:00Z"],
  ["Lucas Ferreira", "Cancelled a request", "request", "REQ-1013", "2026-10-05T12:00:00Z"],
  ["Priya Raman", "Reactivated account", "user", "Isla McKenzie", "2026-10-04T15:40:00Z"],
  ["Felix Novak", "Signed in", "auth", "Session", "2026-10-04T07:55:00Z"],
  ["Priya Raman", "Updated service description", "service", "Deep Home Cleaning", "2026-10-03T16:00:00Z"],
  ["Daniel Okafor", "Failed sign-in attempt", "auth", "Session", "2026-10-03T06:12:00Z"],
  ["Priya Raman", "Assigned request to Jordan Lee", "request", "REQ-1023", "2026-10-02T09:15:00Z"],
  ["Amara Nwosu", "Updated profile details", "user", "Amara Nwosu", "2026-10-01T19:00:00Z"],
  ["Priya Raman", "Changed default request priority", "settings", "Platform settings", "2026-09-30T10:00:00Z"],
];

/** FICTIONAL audit-style activity for the admin prototype. */
export const activityLogs: ActivityLog[] = entries.map(([actor, action, category, target, at], i) => ({
  id: `log-${String(entries.length - i).padStart(3, "0")}`,
  actor,
  action,
  category,
  target,
  at,
}));
