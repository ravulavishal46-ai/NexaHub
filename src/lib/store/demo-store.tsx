"use client";

/**
 * DEMO STORE — frontend prototype only.
 *
 * Holds all mock data in React state and saves it to this browser's
 * localStorage so your clicks survive a page refresh. Nothing is sent to a
 * server or database. In a later phase, these actions will be replaced by
 * calls to secure server APIs backed by Supabase.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { activityLogs, notifications } from "@/lib/mock/activity";
import { requests } from "@/lib/mock/requests";
import { services } from "@/lib/mock/services";
import { DEMO_USER_ID, users } from "@/lib/mock/users";
import type {
  AccountStatus,
  ActivityLog,
  AppNotification,
  RequestPriority,
  RequestStatus,
  Service,
  ServiceRequest,
  UserProfile,
} from "@/types";

const STORAGE_KEY = "nexahub-demo-v1";
/** Shown as the actor for admin actions in the prototype (fictional admin). */
export const DEMO_ADMIN_NAME = "Priya Raman";

export interface Preferences {
  emailUpdates: boolean;
  statusAlerts: boolean;
  productNews: boolean;
}

interface DemoData {
  signedIn: boolean;
  services: Service[];
  requests: ServiceRequest[];
  users: UserProfile[];
  notifications: AppNotification[];
  activity: ActivityLog[];
  preferences: Preferences;
  /** Services the user saved with the heart button. */
  savedServiceIds: string[];
}

const seed = (): DemoData => ({
  signedIn: true,
  services: structuredClone(services),
  requests: structuredClone(requests),
  users: structuredClone(users),
  notifications: structuredClone(notifications),
  activity: structuredClone(activityLogs),
  preferences: {
    emailUpdates: true,
    statusAlerts: true,
    productNews: false,
  },
  savedServiceIds: ["svc-network", "svc-website-audit"],
});

export interface NewRequestInput {
  serviceId: string;
  requirements: string;
  preferredDate?: string;
  notes?: string;
  priority: RequestPriority;
}

export type ServiceInput = Omit<Service, "id" | "createdAt" | "slug"> & { id?: string };

interface DemoStore extends DemoData {
  /** False until saved demo data has been loaded from this browser. */
  hydrated: boolean;
  currentUser: UserProfile;
  signIn: () => void;
  register: (name: string, email: string) => void;
  signOut: () => void;
  updateProfile: (patch: Partial<Pick<UserProfile, "name" | "phone" | "city">>) => void;
  setPreferences: (patch: Partial<Preferences>) => void;
  createRequest: (input: NewRequestInput) => ServiceRequest;
  cancelRequest: (id: string) => void;
  updateRequestStatus: (id: string, status: RequestStatus, note?: string) => void;
  assignRequest: (id: string, assignee: string) => void;
  saveService: (input: ServiceInput) => Service;
  setServiceActive: (id: string, active: boolean) => void;
  setUserStatus: (id: string, status: AccountStatus) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  /** Record an admin action in the activity log (e.g. settings changes). */
  logAdminAction: (action: string, category: ActivityLog["category"], target: string) => void;
  toggleSavedService: (id: string) => boolean;
  rateRequest: (id: string, rating: number, comment?: string) => void;
  resetDemo: () => void;
}

const DemoStoreContext = createContext<DemoStore | null>(null);

const nowIso = () => new Date().toISOString();

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const statusLabel: Record<RequestStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoData>(seed);
  const [hydrated, setHydrated] = useState(false);

  // Load saved demo data once (browser storage may be unavailable — that's fine).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<DemoData>;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from browser storage
        setData((prev) => ({ ...prev, ...saved }));
      }
    } catch {
      /* ignore unreadable storage */
    }
    setHydrated(true);
  }, []);

  // Save after every change (only once the saved copy has been loaded).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full or blocked — the demo still works in memory */
    }
  }, [data, hydrated]);

  const log = useCallback(
    (actor: string, action: string, category: ActivityLog["category"], target: string) => {
      setData((d) => ({
        ...d,
        activity: [
          { id: `log-${Date.now()}`, actor, action, category, target, at: nowIso() },
          ...d.activity,
        ],
      }));
    },
    [],
  );

  const currentUser = useMemo(
    () => data.users.find((u) => u.id === DEMO_USER_ID) ?? data.users[0],
    [data.users],
  );

  const signIn = useCallback(() => setData((d) => ({ ...d, signedIn: true })), []);
  const signOut = useCallback(() => setData((d) => ({ ...d, signedIn: false })), []);

  const register = useCallback((name: string, email: string) => {
    setData((d) => ({
      ...d,
      signedIn: true,
      users: d.users.map((u) => (u.id === DEMO_USER_ID ? { ...u, name, email } : u)),
    }));
  }, []);

  const updateProfile: DemoStore["updateProfile"] = useCallback((patch) => {
    setData((d) => ({
      ...d,
      users: d.users.map((u) => (u.id === DEMO_USER_ID ? { ...u, ...patch } : u)),
    }));
  }, []);

  const setPreferences: DemoStore["setPreferences"] = useCallback((patch) => {
    setData((d) => ({ ...d, preferences: { ...d.preferences, ...patch } }));
  }, []);

  const createRequest = useCallback(
    (input: NewRequestInput) => {
      const maxId = Math.max(
        1000,
        ...data.requests.map((r) => Number(r.id.replace("REQ-", "")) || 0),
      );
      const at = nowIso();
      const request: ServiceRequest = {
        id: `REQ-${maxId + 1}`,
        userId: DEMO_USER_ID,
        serviceId: input.serviceId,
        requirements: input.requirements,
        preferredDate: input.preferredDate || undefined,
        notes: input.notes || undefined,
        priority: input.priority,
        status: "pending",
        createdAt: at,
        updatedAt: at,
        timeline: [{ status: "pending", at, by: "You", note: "Request submitted." }],
      };
      setData((d) => ({ ...d, requests: [request, ...d.requests] }));
      log(currentUser.name, "Submitted a new request", "request", request.id);
      return request;
    },
    [data.requests, currentUser.name, log],
  );

  const pushStatus = useCallback(
    (id: string, status: RequestStatus, by: string, note?: string) => {
      const at = nowIso();
      setData((d) => {
        const target = d.requests.find((r) => r.id === id);
        const notify =
          target?.userId === DEMO_USER_ID && by !== "You"
            ? [
                {
                  id: `ntf-${Date.now()}`,
                  kind: "status" as const,
                  title: `Request ${id} is now ${statusLabel[status].toLowerCase()}`,
                  body: note || "An administrator updated your request.",
                  at,
                  read: false,
                  href: `/dashboard/requests/${id}`,
                },
              ]
            : [];
        return {
          ...d,
          notifications: [...notify, ...d.notifications],
          requests: d.requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status,
                  updatedAt: at,
                  timeline: [...r.timeline, { status, at, by, note }],
                }
              : r,
          ),
        };
      });
    },
    [],
  );

  const cancelRequest = useCallback(
    (id: string) => {
      pushStatus(id, "cancelled", "You", "Cancelled by you.");
      log(currentUser.name, "Cancelled a request", "request", id);
    },
    [pushStatus, log, currentUser.name],
  );

  const updateRequestStatus = useCallback(
    (id: string, status: RequestStatus, note?: string) => {
      pushStatus(id, status, `${DEMO_ADMIN_NAME} (admin)`, note);
      log(DEMO_ADMIN_NAME, `Updated request status to ${statusLabel[status]}`, "request", id);
    },
    [pushStatus, log],
  );

  const assignRequest = useCallback(
    (id: string, assignee: string) => {
      setData((d) => ({
        ...d,
        requests: d.requests.map((r) =>
          r.id === id
            ? { ...r, assignee: assignee === "Unassigned" ? undefined : assignee, updatedAt: nowIso() }
            : r,
        ),
      }));
      log(DEMO_ADMIN_NAME, `Assigned request to ${assignee}`, "request", id);
    },
    [log],
  );

  const saveService = useCallback(
    (input: ServiceInput) => {
      const existing = input.id ? data.services.find((s) => s.id === input.id) : undefined;
      const service: Service = existing
        ? { ...existing, ...input, id: existing.id }
        : {
            ...input,
            id: `svc-${Date.now()}`,
            slug: slugify(input.name),
            createdAt: nowIso(),
          };
      setData((d) => ({
        ...d,
        services: existing
          ? d.services.map((s) => (s.id === service.id ? service : s))
          : [service, ...d.services],
      }));
      log(DEMO_ADMIN_NAME, existing ? "Updated service" : "Created service", "service", service.name);
      return service;
    },
    [data.services, log],
  );

  const setServiceActive = useCallback(
    (id: string, active: boolean) => {
      const svc = data.services.find((s) => s.id === id);
      setData((d) => ({
        ...d,
        services: d.services.map((s) => (s.id === id ? { ...s, isActive: active } : s)),
      }));
      log(
        DEMO_ADMIN_NAME,
        active ? "Reactivated service" : "Deactivated service",
        "service",
        svc?.name ?? id,
      );
    },
    [data.services, log],
  );

  const setUserStatus = useCallback(
    (id: string, status: AccountStatus) => {
      const user = data.users.find((u) => u.id === id);
      setData((d) => ({
        ...d,
        users: d.users.map((u) => (u.id === id ? { ...u, status } : u)),
      }));
      log(
        DEMO_ADMIN_NAME,
        status === "suspended" ? "Suspended account" : "Reactivated account",
        "user",
        user?.name ?? id,
      );
    },
    [data.users, log],
  );

  /** Adds or removes a saved service; returns true when it is now saved. */
  const toggleSavedService = useCallback(
    (id: string) => {
      const willSave = !data.savedServiceIds.includes(id);
      setData((d) => ({
        ...d,
        savedServiceIds: willSave
          ? [id, ...d.savedServiceIds.filter((s) => s !== id)]
          : d.savedServiceIds.filter((s) => s !== id),
      }));
      return willSave;
    },
    [data.savedServiceIds],
  );

  const rateRequest = useCallback(
    (id: string, rating: number, comment?: string) => {
      const at = nowIso();
      setData((d) => ({
        ...d,
        requests: d.requests.map((r) =>
          r.id === id ? { ...r, feedback: { rating, comment: comment || undefined, at } } : r,
        ),
      }));
      log(currentUser.name, `Rated a completed request ${rating}/5`, "request", id);
    },
    [log, currentUser.name],
  );

  const markNotificationRead = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      notifications: d.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setData((d) => ({
      ...d,
      notifications: d.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const logAdminAction = useCallback(
    (action: string, category: ActivityLog["category"], target: string) =>
      log(DEMO_ADMIN_NAME, action, category, target),
    [log],
  );

  const resetDemo = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setData(seed());
  }, []);

  const value = useMemo<DemoStore>(
    () => ({
      ...data,
      hydrated,
      currentUser,
      signIn,
      register,
      signOut,
      updateProfile,
      setPreferences,
      createRequest,
      cancelRequest,
      updateRequestStatus,
      assignRequest,
      saveService,
      setServiceActive,
      setUserStatus,
      markNotificationRead,
      markAllNotificationsRead,
      logAdminAction,
      toggleSavedService,
      rateRequest,
      resetDemo,
    }),
    [
      data,
      hydrated,
      currentUser,
      signIn,
      register,
      signOut,
      updateProfile,
      setPreferences,
      createRequest,
      cancelRequest,
      updateRequestStatus,
      assignRequest,
      saveService,
      setServiceActive,
      setUserStatus,
      markNotificationRead,
      markAllNotificationsRead,
      logAdminAction,
      toggleSavedService,
      rateRequest,
      resetDemo,
    ],
  );

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>;
}

export function useDemoStore() {
  const ctx = useContext(DemoStoreContext);
  if (!ctx) throw new Error("useDemoStore must be used inside <DemoStoreProvider>");
  return ctx;
}

/** Convenience: requests belonging to the signed-in demo user. */
export function useMyRequests() {
  const { requests } = useDemoStore();
  return useMemo(() => requests.filter((r) => r.userId === DEMO_USER_ID), [requests]);
}
