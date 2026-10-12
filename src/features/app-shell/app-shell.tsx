"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { BackButton } from "@/components/navigation/back-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./sidebar-nav";
import type { NavItem } from "./types";

const COLLAPSE_KEY = "nexahub-sidebar-collapsed";

interface AppShellProps {
  nav: NavItem[];
  /** Label under the logo, e.g. "Admin console". */
  areaLabel: string;
  homeHref: string;
  /** Content pinned at the top of the sidebar (e.g. "New request" button). */
  sidebarTop?: (collapsed: boolean) => ReactNode;
  /** Content pinned at the bottom of the sidebar. */
  sidebarBottom?: (collapsed: boolean, close: () => void) => ReactNode;
  /** Right side of the top bar (notifications, user menu…). */
  topbarRight?: ReactNode;
  /** Search control shown at the start of the top bar's right side. */
  search?: ReactNode;
  /** Thin notice under the top bar (prototype disclaimers). */
  banner?: ReactNode;
  children: ReactNode;
}

export function AppShell({
  nav,
  areaLabel,
  homeHref,
  sidebarTop,
  sidebarBottom,
  topbarRight,
  search,
  banner,
  children,
}: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Remember the collapsed state in this browser (optional convenience).
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of a saved preference
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        window.localStorage.setItem(COLLAPSE_KEY, c ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !c;
    });
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-64",
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-sidebar-border", collapsed ? "justify-center px-2" : "px-5")}>
          <Logo href={homeHref} showWordmark={!collapsed} />
          {!collapsed && (
            <span className="ml-2 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              {areaLabel}
            </span>
          )}
        </div>
        {sidebarTop && <div className={cn("pt-4", collapsed ? "px-3" : "px-4")}>{sidebarTop(collapsed)}</div>}
        <nav aria-label={`${areaLabel} navigation`} className={cn("flex-1 overflow-y-auto py-4", collapsed ? "px-3" : "px-3")}>
          <SidebarNav items={nav} collapsed={collapsed} />
        </nav>
        <div className={cn("space-y-1 border-t border-sidebar-border py-3", collapsed ? "px-3" : "px-3")}>
          {sidebarBottom?.(collapsed, () => {})}
          <button
            type="button"
            onClick={toggleCollapsed}
            className={cn(
              "flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors outline-none hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40",
              collapsed && "justify-center px-0",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? <PanelLeftOpen className="size-[18px]" /> : <PanelLeftClose className="size-[18px]" />}
            {!collapsed && "Collapse"}
          </button>
        </div>
      </aside>

      <div className={cn("flex min-h-dvh flex-col transition-[padding] duration-200", collapsed ? "lg:pl-[72px]" : "lg:pl-64")}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b sm:gap-3 border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">{areaLabel} navigation</SheetTitle>
              <SheetDescription className="sr-only">Move between sections</SheetDescription>
              <div className="flex h-16 items-center gap-2 border-b border-border px-5">
                <Logo href={homeHref} />
                <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                  {areaLabel}
                </span>
              </div>
              {sidebarTop && <div className="px-4 pt-4" onClick={closeMobile}>{sidebarTop(false)}</div>}
              <nav aria-label={`${areaLabel} mobile navigation`} className="flex-1 overflow-y-auto p-3">
                <SidebarNav items={nav} onNavigate={closeMobile} />
              </nav>
              {sidebarBottom && <div className="border-t border-border p-3">{sidebarBottom(false, closeMobile)}</div>}
            </SheetContent>
          </Sheet>
          <BackButton className="-ml-1" />
          <Link href={homeHref} className="min-w-0 truncate font-semibold tracking-tight lg:hidden">
            {areaLabel}
          </Link>
          <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
            {search}
            <ThemeToggle />
            {topbarRight}
          </div>
        </header>
        {banner}
        <main id="main" className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
