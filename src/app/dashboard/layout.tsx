import type { Metadata } from "next";
import { UserShell } from "@/features/dashboard/user-shell";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard · NexaHub" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <UserShell>{children}</UserShell>;
}
