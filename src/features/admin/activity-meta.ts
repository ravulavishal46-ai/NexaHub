import type { ActivityCategory } from "@/types";

export const categoryLabel: Record<ActivityCategory, string> = {
  auth: "Sign-in",
  service: "Service",
  request: "Request",
  user: "User",
  settings: "Settings",
};
