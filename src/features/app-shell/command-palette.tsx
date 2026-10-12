"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import { ClipboardList, CornerDownLeft, Package, Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { statusMeta } from "@/components/shared/status-badge";
import { DEMO_USER_ID } from "@/lib/mock/users";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn } from "@/lib/utils";
import type { NavItem } from "./types";

interface Result {
  id: string;
  group: "Pages" | "Services" | "Requests";
  label: string;
  hint?: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

/**
 * Quick search (Ctrl+K / ⌘K): jump to any page, service or request.
 * Users search their own requests; admins search all requests.
 */
export function CommandPalette({ area, nav }: { area: "user" | "admin"; nav: NavItem[] }) {
  const router = useRouter();
  const { services, requests } = useDemoStore();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    const has = (...texts: (string | undefined)[]) => !q || texts.some((t) => t?.toLowerCase().includes(q));
    const serviceName = new Map(services.map((s) => [s.id, s.name]));

    const pages: Result[] = nav
      .filter((n) => has(n.label))
      .map((n) => ({ id: `page-${n.href}`, group: "Pages", label: n.label, href: n.href, icon: n.icon }));

    const svc: Result[] = services
      .filter((s) => (area === "admin" || s.isActive) && has(s.name, s.shortDescription))
      .slice(0, q ? 6 : 3)
      .map((s) => ({
        id: `svc-${s.id}`,
        group: "Services",
        label: s.name,
        hint: area === "admin" ? (s.isActive ? "Active" : "Inactive") : s.pricing.label,
        href: area === "admin" ? "/admin/services" : `/services/${s.slug}`,
        icon: Package,
      }));

    const reqs: Result[] = requests
      .filter((r) => area === "admin" || r.userId === DEMO_USER_ID)
      .filter((r) => has(r.id, serviceName.get(r.serviceId)))
      .slice(0, q ? 6 : 3)
      .map((r) => ({
        id: `req-${r.id}`,
        group: "Requests",
        label: `${r.id} · ${serviceName.get(r.serviceId) ?? "Request"}`,
        hint: statusMeta[r.status].label,
        href: area === "admin" ? `/admin/requests?open=${r.id}` : `/dashboard/requests/${r.id}`,
        icon: ClipboardList,
      }));

    return [...pages, ...svc, ...reqs];
  }, [query, nav, services, requests, area]);

  const current = Math.min(active, Math.max(0, results.length - 1));

  function choose(r: Result | undefined) {
    if (!r) return;
    setOpen(false);
    router.push(r.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((current + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((current - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(results[current]);
    }
  }

  // Keep the highlighted result in view while using the arrow keys.
  useEffect(() => {
    document.getElementById(`cmd-${results[current]?.id}`)?.scrollIntoView({ block: "nearest" });
  }, [current, results]);

  const groups = (["Pages", "Services", "Requests"] as const)
    .map((g) => ({ name: g, items: results.filter((r) => r.group === g) }))
    .filter((g) => g.items.length);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-2.5 text-sm text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:w-56 sm:px-3"
        aria-label="Search pages, services and requests"
        aria-keyshortcuts="Control+K Meta+K"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="hidden flex-1 text-left sm:inline">Search…</span>
        <kbd className="hidden rounded border border-border bg-muted px-1.5 font-sans text-[11px] font-medium sm:inline">
          Ctrl K
        </kbd>
      </button>

      <Dialog
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) {
            setQuery("");
            setActive(0);
          }
        }}
      >
        <DialogContent hideClose className="top-[12vh] max-w-xl translate-y-0 gap-0 overflow-hidden p-0">
          <DialogTitle className="sr-only">Quick search</DialogTitle>
          <DialogDescription className="sr-only">
            Type to search pages, services and requests. Use the arrow keys and Enter to open a result.
          </DialogDescription>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-controls="cmd-list"
              aria-activedescendant={results[current] ? `cmd-${results[current].id}` : undefined}
              aria-label="Search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKeyDown}
              placeholder={area === "admin" ? "Search pages, services, request IDs…" : "Search pages, services, your requests…"}
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border bg-muted px-1.5 text-[11px] text-muted-foreground">Esc</kbd>
          </div>
          <div id="cmd-list" role="listbox" aria-label="Results" className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
            {groups.length === 0 ? (
              <p className="px-3 py-10 text-center text-sm text-muted-foreground">No results for “{query}”.</p>
            ) : (
              groups.map((g) => (
                <div key={g.name} role="group" aria-labelledby={`cmd-group-${g.name}`} className="mb-1">
                  <p id={`cmd-group-${g.name}`} className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                    {g.name}
                  </p>
                  {g.items.map((r) => {
                    const index = results.indexOf(r);
                    const selected = index === current;
                    return (
                      <div
                        key={r.id}
                        id={`cmd-${r.id}`}
                        role="option"
                        aria-selected={selected}
                        onMouseMove={() => setActive(index)}
                        onClick={() => choose(r)}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                          selected ? "bg-accent text-foreground" : "text-foreground/90",
                        )}
                      >
                        <r.icon className="size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1 truncate">{r.label}</span>
                        {r.hint && <span className="shrink-0 text-xs text-muted-foreground">{r.hint}</span>}
                        {selected && <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
          <div className="flex items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
            <span>↑↓ to move</span>
            <span>Enter to open</span>
            <span>Esc to close</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
