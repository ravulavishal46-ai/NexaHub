import type { Metadata } from "next";
import { ActivityLogView } from "@/features/admin/activity-log";

export const metadata: Metadata = { title: "Activity Logs" };

export default function Page() {
  return <ActivityLogView />;
}
