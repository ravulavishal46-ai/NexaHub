"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { ServiceIcon } from "@/components/shared/service-icon";
import { PriorityLabel, StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { ServiceRequest } from "@/types";
import { useServiceLookup } from "./use-service-lookup";

interface RequestsTableProps {
  requests: ServiceRequest[];
  caption: string;
  /** Builds the link for the Details action. */
  detailsHref?: (r: ServiceRequest) => string;
  /** Alternative to a link: open something (e.g. a side panel). */
  onDetails?: (r: ServiceRequest) => void;
  showPriority?: boolean;
  /** Extra column (e.g. the customer name for admins). */
  extraColumn?: { header: string; cell: (r: ServiceRequest) => ReactNode };
  loading?: boolean;
}

/**
 * Requests as a table on larger screens and as stacked cards on phones,
 * so nothing ever forces the page to scroll sideways.
 */
export function RequestsTable({
  requests,
  caption,
  detailsHref,
  onDetails,
  showPriority,
  extraColumn,
  loading,
}: RequestsTableProps) {
  const getService = useServiceLookup();

  if (loading) {
    return (
      <div className="space-y-3 p-5" aria-busy="true" aria-label="Loading requests">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  const action = (r: ServiceRequest, label: string) =>
    onDetails ? (
      <Button variant="outline" size="sm" onClick={() => onDetails(r)}>
        {label} <span className="sr-only">for {r.id}</span>
      </Button>
    ) : (
      <Button variant="outline" size="sm" asChild>
        <Link href={detailsHref?.(r) ?? "#"}>
          {label} <span className="sr-only">for {r.id}</span>
        </Link>
      </Button>
    );

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden md:block">
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Service</TableHead>
              {extraColumn && <TableHead>{extraColumn.header}</TableHead>}
              <TableHead>Submitted</TableHead>
              {showPriority && <TableHead>Priority</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((r) => {
              const service = getService(r.serviceId);
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs font-medium">{r.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {service && <ServiceIcon icon={service.icon} category={service.categoryId} size="sm" />}
                      <span className="font-medium">{service?.name ?? "Unknown service"}</span>
                    </div>
                  </TableCell>
                  {extraColumn && <TableCell>{extraColumn.cell(r)}</TableCell>}
                  <TableCell className="text-muted-foreground">{formatDate(r.createdAt)}</TableCell>
                  {showPriority && (
                    <TableCell>
                      <PriorityLabel priority={r.priority} />
                    </TableCell>
                  )}
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                  <TableCell className="text-right">{action(r, "Details")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-border md:hidden" aria-label={caption}>
        {requests.map((r) => {
          const service = getService(r.serviceId);
          const inner = (
            <>
              {service && <ServiceIcon icon={service.icon} category={service.categoryId} size="sm" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-medium">{service?.name ?? "Unknown service"}</p>
                  <StatusBadge status={r.status} />
                </div>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {r.id} · {formatDate(r.createdAt)}
                </p>
                {extraColumn && <div className="mt-1 text-xs text-muted-foreground">{extraColumn.cell(r)}</div>}
              </div>
              <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
            </>
          );
          const cls = "flex w-full cursor-pointer items-start gap-3 px-4 py-4 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none";
          return (
            <li key={r.id}>
              {onDetails ? (
                <button type="button" className={cls} onClick={() => onDetails(r)}>
                  {inner}
                </button>
              ) : (
                <Link href={detailsHref?.(r) ?? "#"} className={cls}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
