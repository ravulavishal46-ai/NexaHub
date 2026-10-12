"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  ArrowLeftRight,
  BarChart3,
  ClipboardList,
  ExternalLink,
  Globe,
  LayoutDashboard,
  Package,
  RotateCcw,
  Settings,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AppShell } from "@/features/app-shell/app-shell";
import { CommandPalette } from "@/features/app-shell/command-palette";
import { DemoBanner } from "@/features/app-shell/demo-banner";
import type { NavItem } from "@/features/app-shell/types";
import { UserMenu } from "@/features/app-shell/user-menu";
import { DEMO_ADMIN_NAME, useDemoStore } from "@/lib/store/demo-store";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: ReactNode }) {
  const { requests, resetDemo } = useDemoStore();
  const pending = requests.filter((r) => r.status === "pending").length;

  const nav: NavItem[] = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Services", href: "/admin/services", icon: Package },
    { label: "Service Requests", href: "/admin/requests", icon: ClipboardList, badge: pending },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Activity Logs", href: "/admin/activity", icon: Activity },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <AppShell
      nav={nav}
      search={<CommandPalette area="admin" nav={nav} />}
      areaLabel="Admin"
      homeHref="/admin"
      sidebarBottom={(collapsed, close) => (
        <Link
          href="/dashboard"
          onClick={close}
          title={collapsed ? "Switch to user dashboard" : undefined}
          className={cn(
            "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40",
            collapsed && "justify-center px-0",
          )}
        >
          <ArrowLeftRight className="size-[18px]" aria-hidden />
          <span className={cn(collapsed && "sr-only")}>User dashboard</span>
        </Link>
      )}
      topbarRight={
        <UserMenu
          name={DEMO_ADMIN_NAME}
          email="priya.raman@example.com"
          roleBadge={<Badge variant="teal">Admin</Badge>}
          items={[
            { label: "Platform settings", icon: Settings, href: "/admin/settings" },
            { label: "Switch to user dashboard", icon: ArrowLeftRight, href: "/dashboard" },
            { label: "View public website", icon: Globe, href: "/" },
            {
              label: "Reset demo data",
              icon: RotateCcw,
              separatorBefore: true,
              onSelect: () => {
                resetDemo();
                toast.success("Demo data reset");
              },
            },
          ]}
        />
      }
      banner={
        <DemoBanner tone="warning">
          <span className="font-medium">Admin UI prototype — no access control is enforced.</span>{" "}
          Real admin access will be protected by Supabase Auth, server-side checks and row-level
          security in a later phase. All people and data are fictional.{" "}
          <Link href="/" className="inline-flex items-center gap-0.5 underline underline-offset-2">
            Website <ExternalLink className="size-3" aria-hidden />
          </Link>
        </DemoBanner>
      }
    >
      {children}
    </AppShell>
  );
}
