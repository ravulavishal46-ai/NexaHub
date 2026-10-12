"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { RequestsTable } from "@/features/requests/requests-table";
import { useServiceLookup } from "@/features/requests/use-service-lookup";
import { useDemoStore } from "@/lib/store/demo-store";
import type { RequestPriority, RequestStatus } from "@/types";
import { RequestPanel } from "./request-panel";

const PAGE_SIZE = 10;
const STATUSES: { value: "all" | RequestStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function RequestsManager() {
  const { requests, users, hydrated } = useDemoStore();
  const getService = useServiceLookup();
  const router = useRouter();
  const pathname = usePathname();
  // The open request lives in the URL (?open=REQ-1234) so it can be linked to directly.
  const openId = useSearchParams().get("open");

  const [status, setStatus] = useState<"all" | RequestStatus>("all");
  const [priority, setPriority] = useState<"all" | RequestPriority>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const userName = useMemo(() => new Map(users.map((u) => [u.id, u.name])), [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...requests]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((r) => status === "all" || r.status === status)
      .filter((r) => priority === "all" || r.priority === priority)
      .filter(
        (r) =>
          !q ||
          r.id.toLowerCase().includes(q) ||
          (getService(r.serviceId)?.name.toLowerCase().includes(q) ?? false) ||
          (userName.get(r.userId)?.toLowerCase().includes(q) ?? false),
      );
  }, [requests, status, priority, query, getService, userName]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const openRequest = openId ? requests.find((r) => r.id === openId) : undefined;
  const count = (s: "all" | RequestStatus) => (s === "all" ? requests.length : requests.filter((r) => r.status === s).length);

  const clear = () => {
    setStatus("all");
    setPriority("all");
    setQuery("");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Service requests" description="Review, assign and update requests from every customer." />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 xl:flex-row xl:items-center xl:justify-between">
          <FilterTabs
            label="Filter by status"
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            options={STATUSES.map((s) => ({
              value: s.value,
              label: (
                <>
                  {s.label} <span className="text-xs text-muted-foreground tabular-nums">{count(s.value)}</span>
                </>
              ),
            }))}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                type="search"
                placeholder="Search ID, service or customer"
                aria-label="Search requests"
                className="pl-9"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Select
              value={priority}
              onValueChange={(v) => {
                setPriority(v as typeof priority);
                setPage(1);
              }}
            >
              <SelectTrigger className="sm:w-40" aria-label="Filter by priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hydrated && filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={SearchX}
              title="No requests match these filters"
              description="Try a different status, priority or search term."
              action={<Button variant="outline" onClick={clear}>Clear filters</Button>}
            />
          </div>
        ) : (
          <>
            <RequestsTable
              requests={visible}
              caption="All service requests"
              loading={!hydrated}
              showPriority
              extraColumn={{ header: "Customer", cell: (r) => userName.get(r.userId) ?? "Unknown" }}
              onDetails={(r) => router.push(`${pathname}?open=${r.id}`, { scroll: false })}
            />
            {hydrated && (
              <Pagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} label="requests" />
            )}
          </>
        )}
      </Card>

      <Sheet
        open={Boolean(openId)}
        onOpenChange={(open) => {
          if (!open) router.replace(pathname, { scroll: false });
        }}
      >
        <SheetContent side="right" className="w-full max-w-lg overflow-y-auto sm:w-[88%]">
          <SheetHeader>
            <SheetTitle className="font-mono">{openId}</SheetTitle>
            <SheetDescription>Request details and actions</SheetDescription>
          </SheetHeader>
          {!hydrated ? (
            <div className="space-y-4 p-5">
              <Skeleton className="h-16" />
              <Skeleton className="h-32" />
            </div>
          ) : openRequest ? (
            <RequestPanel key={openRequest.id} request={openRequest} />
          ) : (
            <p className="p-5 text-sm text-muted-foreground">This request could not be found.</p>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
