import type { RequestPriority, RequestStatus, ServiceRequest } from "@/types";
import { DEMO_USER_ID } from "./users";

/**
 * FICTIONAL DEMO REQUESTS.
 * Built from a compact table so the timeline for each request is consistent.
 */

type Row = [
  id: number,
  serviceId: string,
  userId: string,
  created: string,
  status: RequestStatus,
  priority: RequestPriority,
  requirements: string,
  assignee?: string,
];

const rows: Row[] = [
  [1001, "svc-deep-clean", DEMO_USER_ID, "2026-08-04T10:12:00Z", "completed", "normal", "Deep clean of a two-bedroom apartment before guests arrive. Focus on kitchen and bathroom.", "Samira Patel"],
  [1004, "svc-laptop", DEMO_USER_ID, "2026-08-21T15:40:00Z", "completed", "high", "Laptop fan is constantly loud and battery drains in about an hour.", "Jordan Lee"],
  [1009, "svc-network", DEMO_USER_ID, "2026-09-02T09:05:00Z", "cancelled", "low", "Wi-Fi drops in the back bedroom. Would like mesh coverage.", undefined],
  [1015, "svc-plumbing", DEMO_USER_ID, "2026-09-18T08:30:00Z", "completed", "high", "Kitchen tap leaking at the base; water pooling under the sink.", "Chris Navarro"],
  [1022, "svc-backup", DEMO_USER_ID, "2026-10-01T13:20:00Z", "in_progress", "normal", "Set up automatic backups for two laptops and a shared family photo folder.", "Jordan Lee"],
  [1027, "svc-electrical", DEMO_USER_ID, "2026-10-07T11:00:00Z", "pending", "normal", "Pre-purchase style safety check for a 1990s townhouse, 3 floors.", undefined],
  [1031, "svc-website-audit", DEMO_USER_ID, "2026-10-10T16:45:00Z", "pending", "low", "Audit for a small portfolio site; mainly concerned with mobile speed.", undefined],
  [1002, "svc-moving", "usr-003", "2026-08-06T07:50:00Z", "completed", "normal", "Move from a studio to a one-bedroom across town, 2nd floor no lift.", "Bea Thompson"],
  [1003, "svc-bookkeeping", "usr-005", "2026-08-12T12:00:00Z", "completed", "normal", "New design studio, need books set up before first invoices go out.", "Samira Patel"],
  [1005, "svc-office-clean", "usr-008", "2026-08-25T18:10:00Z", "completed", "low", "Weekly clean for a 6-desk office, Friday evenings preferred.", "Bea Thompson"],
  [1006, "svc-appliance", "usr-010", "2026-08-28T09:30:00Z", "cancelled", "normal", "Install a new dishwasher in place of the old one.", undefined],
  [1007, "svc-deep-clean", "usr-011", "2026-08-30T14:00:00Z", "completed", "normal", "End-of-tenancy clean for a three-bedroom house.", "Samira Patel"],
  [1008, "svc-laptop", "usr-012", "2026-09-01T10:25:00Z", "completed", "high", "Laptop won't boot past the logo screen.", "Jordan Lee"],
  [1010, "svc-plumbing", "usr-014", "2026-09-05T08:00:00Z", "completed", "high", "Bathroom drain fully blocked.", "Chris Navarro"],
  [1011, "svc-network", "usr-015", "2026-09-08T17:30:00Z", "completed", "normal", "Home office has weak signal; need wired or mesh solution.", "Jordan Lee"],
  [1012, "svc-website-audit", "usr-016", "2026-09-10T11:15:00Z", "completed", "normal", "Audit of an online ceramics shop before the holiday season.", "Chris Navarro"],
  [1013, "svc-backup", "usr-018", "2026-09-12T13:45:00Z", "cancelled", "low", "Backups for a small accountancy office, 4 machines.", undefined],
  [1014, "svc-moving", "usr-019", "2026-09-15T07:00:00Z", "completed", "normal", "Local move, mostly boxes plus a sofa and a bed frame.", "Bea Thompson"],
  [1016, "svc-electrical", "usr-020", "2026-09-20T10:40:00Z", "completed", "normal", "Some outlets in the kitchen stopped working after a storm.", "Chris Navarro"],
  [1017, "svc-deep-clean", "usr-021", "2026-09-22T15:00:00Z", "in_progress", "normal", "Spring-style deep clean, special attention to the oven exterior.", "Samira Patel"],
  [1018, "svc-bookkeeping", "usr-023", "2026-09-24T09:10:00Z", "in_progress", "high", "Freelance consultancy needs quarterly-ready books.", "Samira Patel"],
  [1019, "svc-appliance", "usr-024", "2026-09-27T12:30:00Z", "completed", "low", "Install a wall oven; the cut-out is already prepared.", "Chris Navarro"],
  [1020, "svc-laptop", "usr-004", "2026-09-29T16:00:00Z", "in_progress", "normal", "Laptop very slow after an update.", "Jordan Lee"],
  [1021, "svc-office-clean", "usr-007", "2026-09-30T19:20:00Z", "pending", "normal", "One-off clean after an office renovation.", undefined],
  [1023, "svc-network", "usr-002", "2026-10-02T08:50:00Z", "in_progress", "normal", "Set up a guest network for a small café.", "Jordan Lee"],
  [1024, "svc-plumbing", "usr-011", "2026-10-03T07:35:00Z", "pending", "high", "Toilet keeps running and the cistern refills constantly.", undefined],
  [1025, "svc-moving", "usr-015", "2026-10-05T10:00:00Z", "pending", "normal", "Moving a home office: desk, shelving and about 20 boxes.", undefined],
  [1026, "svc-website-audit", "usr-020", "2026-10-06T14:25:00Z", "in_progress", "low", "Review of a booking site for a yoga studio.", "Chris Navarro"],
  [1028, "svc-deep-clean", "usr-019", "2026-10-08T09:00:00Z", "pending", "normal", "Deep clean before listing an apartment for sale.", undefined],
  [1029, "svc-backup", "usr-012", "2026-10-09T11:30:00Z", "pending", "normal", "Cloud backup for a photography archive (~2 TB).", undefined],
  [1030, "svc-appliance", "usr-005", "2026-10-09T15:10:00Z", "in_progress", "normal", "Washer-dryer stack installation.", "Bea Thompson"],
  [1032, "svc-laptop", "usr-024", "2026-10-11T12:05:00Z", "pending", "high", "Liquid spill on keyboard; some keys not responding.", undefined],
];

function addHours(iso: string, hours: number) {
  return new Date(new Date(iso).getTime() + hours * 3_600_000).toISOString();
}

function buildTimeline(created: string, status: RequestStatus, assignee?: string) {
  const events: ServiceRequest["timeline"] = [
    { status: "pending", at: created, by: "Customer", note: "Request submitted." },
  ];
  if (status === "in_progress" || status === "completed") {
    events.push({
      status: "in_progress",
      at: addHours(created, 20),
      by: "Operations team",
      note: assignee ? `Assigned to ${assignee}. Visit scheduled.` : "Work has started.",
    });
  }
  if (status === "completed") {
    events.push({
      status: "completed",
      at: addHours(created, 74),
      by: assignee ?? "Operations team",
      note: "Work completed and confirmed with the customer.",
    });
  }
  if (status === "cancelled") {
    events.push({
      status: "cancelled",
      at: addHours(created, 9),
      by: "Customer",
      note: "Request cancelled before scheduling.",
    });
  }
  return events;
}

export const requests: ServiceRequest[] = rows
  .map(([id, serviceId, userId, created, status, priority, requirements, assignee]) => {
    const timeline = buildTimeline(created, status, assignee);
    return {
      id: `REQ-${id}`,
      serviceId,
      userId,
      requirements,
      preferredDate: addHours(created, 24 * 4).slice(0, 10),
      notes: id % 3 === 0 ? "Please call 15 minutes before arriving." : undefined,
      status,
      priority,
      assignee,
      createdAt: created,
      updatedAt: timeline[timeline.length - 1].at,
      timeline,
    } satisfies ServiceRequest;
  })
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
