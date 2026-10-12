"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, CalendarDays, FileQuestion, RotateCw, UserRound, XCircle } from "lucide-react";
import { toast } from "sonner";
import { ServiceIcon } from "@/components/shared/service-icon";
import { PriorityLabel, StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestTimeline } from "@/features/requests/request-timeline";
import { RateRequest } from "./rate-request";
import { useServiceLookup } from "@/features/requests/use-service-lookup";
import { useDemoStore } from "@/lib/store/demo-store";
import { DEMO_USER_ID } from "@/lib/mock/users";
import { formatDate, formatDateTime, simulateLatency } from "@/lib/utils";

export function UserRequestDetail({ id }: { id: string }) {
  const { requests, hydrated, cancelRequest } = useDemoStore();
  const getService = useServiceLookup();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  if (!hydrated) return <RequestDetailSkeleton />;

  // Users can only open their own requests (the real check moves to the server/RLS later).
  const request = requests.find((r) => r.id === id && r.userId === DEMO_USER_ID);
  if (!request) {
    return (
      <EmptyState
        className="mt-6"
        icon={FileQuestion}
        title="Request not found"
        description="This request doesn't exist or isn't available to your account."
        action={
          <Button asChild>
            <Link href="/dashboard/requests">Back to my requests</Link>
          </Button>
        }
      />
    );
  }

  const service = getService(request.serviceId);

  async function handleCancel() {
    setCancelling(true);
    await simulateLatency(600);
    cancelRequest(request!.id);
    setCancelling(false);
    setConfirmOpen(false);
    toast.success(`Request ${request!.id} cancelled`);
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/dashboard/requests">
          <ArrowLeft /> My requests
        </Link>
      </Button>

      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          {service && <ServiceIcon icon={service.icon} category={service.categoryId} size="lg" />}
          <div>
            <p className="font-mono text-xs text-muted-foreground">{request.id}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{service?.name ?? "Service request"}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <StatusBadge status={request.status} />
              <span className="text-sm text-muted-foreground">Submitted {formatDate(request.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {service?.isActive && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/requests/new?service=${service.slug}`}>
                <RotateCw /> Request again
              </Link>
            </Button>
          )}
          {request.status === "pending" && (
            <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirmOpen(true)}>
              <XCircle /> Cancel request
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Requirements</h3>
                <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-line">{request.requirements}</p>
              </div>
              {request.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Additional notes</h3>
                  <p className="mt-1.5 text-sm leading-relaxed">{request.notes}</p>
                </div>
              )}
              <dl className="grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-3">
                <div>
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarDays className="size-3.5" aria-hidden /> Preferred date
                  </dt>
                  <dd className="mt-1 font-medium">{request.preferredDate ? formatDate(request.preferredDate) : "Flexible"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Priority</dt>
                  <dd className="mt-1">
                    <PriorityLabel priority={request.priority} />
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-muted-foreground">
                    <UserRound className="size-3.5" aria-hidden /> Assigned to
                  </dt>
                  <dd className="mt-1 font-medium">{request.assignee ?? "Not yet assigned"}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          {request.status === "completed" && <RateRequest request={request} />}
          {service && (
            <Card>
              <CardHeader>
                <CardTitle>About this service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{service.shortDescription}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>
                    Sample pricing: <span className="font-medium">{service.pricing.label}</span>
                  </span>
                  <Link href={`/services/${service.slug}`} className="font-medium text-primary hover:underline">
                    View service
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Status timeline</CardTitle>
            <p className="text-xs text-muted-foreground">Last updated {formatDateTime(request.updatedAt)}</p>
          </CardHeader>
          <CardContent>
            <RequestTimeline events={request.timeline} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this request?</DialogTitle>
            <DialogDescription>
              {request.id} will be marked as cancelled and moved to your history. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep request</Button>
            </DialogClose>
            <Button variant="destructive" loading={cancelling} onClick={handleCancel}>
              Cancel request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function RequestDetailSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading request">
      <Skeleton className="h-8 w-32" />
      <div className="flex gap-4">
        <Skeleton className="size-14 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}
