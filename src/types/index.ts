/**
 * Shared data shapes for NexaHub.
 * These mirror the database tables planned in docs/ARCHITECTURE.md so the
 * frontend can later switch from mock data to Supabase without UI rewrites.
 */

export type CategoryId =
  | "home-repairs"
  | "cleaning"
  | "it-support"
  | "business"
  | "moving"
  | "coaching";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  icon: IconName;
}

/** Names of icons we allow in data (mapped to Lucide components in the UI). */
export type IconName =
  | "wrench"
  | "zap"
  | "plug"
  | "sparkles"
  | "building"
  | "laptop"
  | "wifi"
  | "database"
  | "calculator"
  | "globe"
  | "truck"
  | "briefcase"
  | "spray"
  | "graduation";

export type PricingModel = "fixed" | "hourly" | "quote";

export interface Pricing {
  model: PricingModel;
  /** Illustrative amount in USD. Not a real price. */
  amount?: number;
  /** Human label, e.g. "From $89" or "Custom quote". */
  label: string;
}

export interface Service {
  id: string;
  slug: string;
  name: string;
  categoryId: CategoryId;
  icon: IconName;
  shortDescription: string;
  description: string;
  features: string[];
  process: { title: string; description: string }[];
  pricing: Pricing;
  /** e.g. "2–3 hours" */
  duration: string;
  isActive: boolean;
  featured?: boolean;
  createdAt: string;
}

export type RequestStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type RequestPriority = "low" | "normal" | "high";

export interface RequestEvent {
  status: RequestStatus;
  at: string;
  note?: string;
  by: string;
}

export interface ServiceRequest {
  id: string;
  serviceId: string;
  userId: string;
  requirements: string;
  preferredDate?: string;
  notes?: string;
  status: RequestStatus;
  priority: RequestPriority;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
  timeline: RequestEvent[];
}

export type UserRole = "user" | "admin";
export type AccountStatus = "active" | "suspended" | "invited";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  city: string;
  role: UserRole;
  status: AccountStatus;
  joinedAt: string;
  lastActiveAt: string;
}

export type NotificationKind = "status" | "system" | "reminder";

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  href?: string;
}

export type ActivityCategory = "auth" | "service" | "request" | "user" | "settings";

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  category: ActivityCategory;
  target: string;
  at: string;
}
