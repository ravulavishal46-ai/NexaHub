"use client";

import { useMemo, useState } from "react";
import { Download, FileSearch, Search } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDemoStore } from "@/lib/store/demo-store";
import { formatDateTime } from "@/lib/utils";
import type { ActivityCategory } from "@/types";
import { categoryLabel } from "./activity-meta";

const PAGE_SIZE = 12;

export function ActivityLogView() {
  const { activity, hydrated } = useDemoStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ActivityCategory>("all");
  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...activity]
      .filter((a) => category === "all" || a.category === category)
      .filter((a) => !q || a.actor.toLowerCase().includes(q) || a.action.toLowerCase().includes(q) || a.target.toLowerCase().includes(q))
      .sort((a, b) => (order === "newest" ? b.at.localeCompare(a.at) : a.at.localeCompare(b.at)));
  }, [activity, query, category, order]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  /** Downloads the filtered log as CSV (generated in the browser). */
  function exportCsv() {
    const header = "Date (UTC),Actor,Action,Category,Target";
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const lines = filtered.map((a) => [a.at, a.actor, a.action, categoryLabel[a.category], a.target].map(escape).join(","));
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nexahub-activity-log-demo.csv";
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} entries`);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity logs"
        description="A read-only record of sensitive actions. In production this becomes an append-only audit table."
        actions={
          <Button variant="outline" onClick={exportCsv} disabled={!hydrated || filtered.length === 0}>
            <Download /> Export CSV
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-border p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              placeholder="Search actor, action or target"
              aria-label="Search activity"
              className="pl-9"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v as typeof category);
              setPage(1);
            }}
          >
            <SelectTrigger className="md:w-44" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {(Object.keys(categoryLabel) as ActivityCategory[]).map((c) => (
                <SelectItem key={c} value={c}>
                  {categoryLabel[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={order} onValueChange={(v) => setOrder(v as typeof order)}>
            <SelectTrigger className="md:w-40" aria-label="Sort by date">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!hydrated ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState icon={FileSearch} title="No matching entries" description="Try a different search or category." />
          </div>
        ) : (
          <>
            <Table>
              <TableCaption>Activity log</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="text-muted-foreground tabular-nums">{formatDateTime(a.at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar name={a.actor} className="size-7 text-[10px]" />
                        <span className="font-medium">{a.actor}</span>
                      </div>
                    </TableCell>
                    <TableCell>{a.action}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{categoryLabel[a.category]}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{a.target}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} label="entries" />
          </>
        )}
      </Card>
    </div>
  );
}
