import type { Metadata } from "next";
import { AdminOverview } from "@/features/admin/overview";

export const metadata: Metadata = { title: "Overview" };

export default function AdminPage() {
  return <AdminOverview />;
}
