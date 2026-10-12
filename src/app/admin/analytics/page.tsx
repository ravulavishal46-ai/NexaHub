import type { Metadata } from "next";
import { AdminAnalytics } from "@/features/admin/analytics";

export const metadata: Metadata = { title: "Analytics" };

export default function Page() {
  return <AdminAnalytics />;
}
