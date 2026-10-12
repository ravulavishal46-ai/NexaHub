"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  ClipboardList,
  Compass,
  Heart,
  History,
  LayoutDashboard,
  LogIn,
  LogOut,
  Plus,
  RotateCcw,
  Settings,
  ShieldHalf,
  UserPlus,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppShell } from "@/features/app-shell/app-shell";
import { CommandPalette } from "@/features/app-shell/command-palette";
import { DemoBanner } from "@/features/app-shell/demo-banner";
import type { NavItem } from "@/features/app-shell/types";
import { UserMenu } from "@/features/app-shell/user-menu";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn } from "@/lib/utils";

export function UserShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { currentUser, notifications, signedIn, hydrated, signOut, resetDemo } = useDemoStore();
  const unread = notifications.filter((n) => !n.read).length;

  const nav: NavItem[] = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard, exact: true },
    { label: "Browse Services", href: "/dashboard/services", icon: Compass },
    { label: "Saved", href: "/dashboard/saved", icon: Heart },
    { label: "My Requests", href: "/dashboard/requests", icon: ClipboardList },
    { label: "Request History", href: "/dashboard/history", icon: History },
    { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: unread },
    { label: "Profile", href: "/dashboard/profile", icon: UserRound },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    signOut();
    toast("Signed out of the demo");
    router.push("/login");
  };

  return (
    <AppShell
      nav={nav}
      search={<CommandPalette area="user" nav={nav} />}
      areaLabel="Dashboard"
      homeHref="/dashboard"
      sidebarTop={(collapsed) => (
        <Button asChild className={cn("w-full", collapsed && "px-0")} title={collapsed ? "New request" : undefined}>
          <Link href="/dashboard/requests/new">
            <Plus />
            <span className={cn(collapsed && "sr-only")}>New request</span>
          </Link>
        </Button>
      )}
      sidebarBottom={(collapsed, close) => {
        const item = cn(
          "flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
          collapsed && "justify-center px-0",
        );
        return (
          <div className="space-y-1">
            <Link href="/login" onClick={close} title={collapsed ? "Log in" : undefined} className={cn(item, "hover:bg-sidebar-accent hover:text-foreground")}>
              <LogIn className="size-[18px]" aria-hidden />
              <span className={cn(collapsed && "sr-only")}>Log in</span>
            </Link>
            <Link href="/register" onClick={close} title={collapsed ? "Sign up" : undefined} className={cn(item, "hover:bg-sidebar-accent hover:text-foreground")}>
              <UserPlus className="size-[18px]" aria-hidden />
              <span className={cn(collapsed && "sr-only")}>Sign up</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                close();
                handleLogout();
              }}
              title={collapsed ? "Logout" : undefined}
              className={cn(item, "hover:bg-danger-soft hover:text-danger")}
            >
              <LogOut className="size-[18px]" aria-hidden />
              <span className={cn(collapsed && "sr-only")}>Logout</span>
            </button>
          </div>
        );
      }}
      topbarRight={
        <>
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/dashboard/notifications" aria-label={`Notifications (${unread} unread)`}>
              <Bell className="size-[18px]" />
              {unread > 0 && (
                <span className="absolute top-2 right-2 size-2 rounded-full bg-primary ring-2 ring-background" aria-hidden />
              )}
            </Link>
          </Button>
          <UserMenu
            name={currentUser.name}
            email={currentUser.email}
            items={[
              { label: "Profile", icon: UserRound, href: "/dashboard/profile" },
              { label: "Settings", icon: Settings, href: "/dashboard/settings" },
              { label: "Admin UI prototype", icon: ShieldHalf, href: "/admin", separatorBefore: true },
              {
                label: "Reset demo data",
                icon: RotateCcw,
                onSelect: () => {
                  resetDemo();
                  toast.success("Demo data reset");
                },
              },
              { label: "Log out", icon: LogOut, onSelect: handleLogout, destructive: true, separatorBefore: true },
            ]}
          />
        </>
      }
      banner={
        <DemoBanner>
          Prototype dashboard — requests and changes are simulated and saved only in this browser, not
          in a real database.
        </DemoBanner>
      }
    >
      {hydrated && !signedIn ? <SignedOut /> : children}
    </AppShell>
  );
}

function SignedOut() {
  const { signIn } = useDemoStore();
  return (
    <Card className="mx-auto mt-10 max-w-md items-center p-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <LogIn className="size-5" aria-hidden />
      </span>
      <h1 className="mt-5 text-xl font-semibold">You&apos;re signed out of the demo</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to view your dashboard. In this prototype, signing in only switches the demo view —
        it is not real authentication.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link href="/login">Go to sign in</Link>
        </Button>
        <Button variant="outline" onClick={signIn}>
          Continue as demo user
        </Button>
      </div>
    </Card>
  );
}
