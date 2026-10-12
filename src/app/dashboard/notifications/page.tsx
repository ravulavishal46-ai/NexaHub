import type { Metadata } from "next";
import { NotificationsList } from "@/features/dashboard/notifications-list";

export const metadata: Metadata = { title: "Notifications" };

export default function Page() {
  return <NotificationsList />;
}
