"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ClipboardList, Plus, Search, SearchX } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestsTable } from "@/features/requests/requests-table";
import { useServiceLookup } from "@/features/requests/use-service-lookup";
import { useDemoStore, useMyRequests } from "@/lib/store/demo-store";
import type { RequestStatus } from "@/types";

const PAGE_SIZE = 8;
const ALL_STATUSES: RequestStatus[] = ["pending", "in_progress", "completed", "cancelled"];
const HISTORY_STATUSES: RequestStatus[] = ["completed", "cancelled"];

const tabLabels: Record<RequestStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface RequestsBrowserProps {
  mode: "requests" | "history";
}

export function RequestsBrowser({ mode }: RequestsBrowserProps) {
  const { hydrated } = useDemoStore();
  const mine = useMyRequests();
  const getService = useServiceLookup();
  const statuses = mode === "history" ? HISTORY_STATUSES : ALL_STATUSES;

  const [status, setStatus] = useState<"all" | RequestStatus>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const scoped = useMemo(() => mine.filter((r) => statuses.includes(r.status)), [mine, statuses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped
      .filter((r) => status === "all" || r.status === status)
      .filter(
        (r) =>
          !q ||
          r.id.toLowerCase().includes(q) ||
          (getService(r.serviceId)?.name.toLowerCase().includes(q) ?? false),
      )
      .sort((a, b) => (sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)));
  }, [scoped, status, query, sort, getService]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const count = (s: RequestStatus) => scoped.filter((r) => r.status === s).length;

  const resetPage = <T,>(fn: (v: T) => void) => (v: T) => {
    fn(v);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={mode === "history" ? "Request History" : "My Requests"}
        description={
          mode === "history"
            ? "Completed and cancelled requests, kept for your reference."
            : "Track the status of every service request you've submitted."
        }
        actions={
          <Button asChild>
            <Link href="/dashboard/requests/new">
              <Plus /> New request
            </Link>
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between">
          <Tabs value={status} onValueChange={(v) => resetPage(setStatus)(v as typeof status)}>
            <TabsList aria-label="Filter by status">
              <TabsTrigger value="all">
                All <span className="text-xs text-muted-foreground tabular-nums">{scoped.length}</span>
              </TabsTrigger>
              {statuses.map((s) => (
                <TabsTrigger key={s} value={s}>
                  {tabLabels[s]} <span className="text-xs text-muted-foreground tabular-nums">{count(s)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                type="search"
                placeholder="Search ID or service"
                aria-label="Search requests"
                className="pl-9"
                value={query}
                onChange={(e) => resetPage(setQuery)(e.target.value)}
              />
            </div>
            <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
              <SelectTrigger className="sm:w-40" aria-label="Sort requests">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hydrated && filtered.length === 0 ? (
          <div className="p-4">
            {scoped.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title={mode === "history" ? "No history yet" : "No requests yet"}
                description={
                  mode === "history"
                    ? "Completed and cancelled requests will appear here."
                    : "Submit your first service request to start tracking it here."
                }
                action={
                  <Button asChild>
                    <Link href="/dashboard/requests/new">Create a request</Link>
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon={SearchX}
                title="No matching requests"
                description="Try another search term or status filter."
                action={
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      setStatus("all");
                      setPage(1);
                    }}
                  >
                    Clear filters
                  </Button>
                }
              />
            )}
          </div>
        ) : (
          <>
            <RequestsTable
              requests={visible}
              caption={mode === "history" ? "Request history" : "My requests"}
              loading={!hydrated}
              showPriority
              detailsHref={(r) => `/dashboard/requests/${r.id}`}
            />
            {hydrated && (
              <Pagination
                page={currentPage}
                pageSize={PAGE_SIZE}
                total={filtered.length}
                onPageChange={setPage}
                label="requests"
              />
            )}
          </>
        )}
      </Card>
    </div>
  );
}
