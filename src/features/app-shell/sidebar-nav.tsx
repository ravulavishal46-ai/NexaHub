"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/utils";
import type { NavItem } from "./types";

interface SidebarNavProps {
  items: NavItem[];
  collapsed?: boolean;
  onNavigate?: () => void;
}

/**
 * The current URL is only known at request time, so the "active" highlight
 * streams in; until then the same links render without a highlight.
 */
export function SidebarNav(props: SidebarNavProps) {
  return (
    <Suspense fallback={<NavList {...props} pathname={null} />}>
      <ActiveNavList {...props} />
    </Suspense>
  );
}

function ActiveNavList(props: SidebarNavProps) {
  return <NavList {...props} pathname={usePathname()} />;
}

function NavList({ items, collapsed = false, onNavigate, pathname }: SidebarNavProps & { pathname: string | null }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const active =
          pathname !== null &&
          (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/80 transition-colors outline-none hover:bg-sidebar-accent hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40",
                active && "bg-sidebar-accent text-foreground",
                collapsed && "justify-center px-0",
              )}
            >
              {active && (
                <span className="absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-primary" aria-hidden />
              )}
              <item.icon
                className={cn("size-[18px] shrink-0", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")}
                aria-hidden
              />
              <span className={cn("flex-1 truncate", collapsed && "sr-only")}>{item.label}</span>
              {!!item.badge && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground",
                    collapsed && "absolute top-1 right-1 h-4 min-w-4 px-1 text-[10px]",
                  )}
                >
                  {item.badge}
                  <span className="sr-only"> unread</span>
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
