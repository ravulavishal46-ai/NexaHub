"use client";

import { useState } from "react";
import { CalendarDays, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { ServiceIcon } from "@/components/shared/service-icon";
import { PriorityLabel, StatusBadge, statusMeta } from "@/components/shared/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RequestTimeline } from "@/features/requests/request-timeline";
import { useServiceLookup } from "@/features/requests/use-service-lookup";
import { staff } from "@/lib/mock/users";
import { useDemoStore } from "@/lib/store/demo-store";
import { formatDate, simulateLatency } from "@/lib/utils";
import type { RequestStatus, ServiceRequest } from "@/types";

/** Everything an admin needs to review and progress one request. */
export function RequestPanel({ request }: { request: ServiceRequest }) {
  const { users, assignRequest, updateRequestStatus } = useDemoStore();
  const getService = useServiceLookup();
  const service = getService(request.serviceId);
  const customer = users.find((u) => u.id === request.userId);

  const [nextStatus, setNextStatus] = useState<RequestStatus>(request.status);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveStatus() {
    setSaving(true);
    await simulateLatency(600);
    updateRequestStatus(request.id, nextStatus, note.trim() || undefined);
    setSaving(false);
    setNote("");
    toast.success(`${request.id} marked as ${statusMeta[nextStatus].label}`, {
      description: "The customer was notified (demo).",
    });
  }

  return (
    <div className="space-y-6 p-5">
      <div className="flex items-start gap-3">
        {service && <ServiceIcon icon={service.icon} category={service.categoryId} />}
        <div className="min-w-0">
          <p className="font-semibold">{service?.name ?? "Unknown service"}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <StatusBadge status={request.status} />
            <PriorityLabel priority={request.priority} />
          </div>
        </div>
      </div>

      {customer && (
        <section aria-label="Customer" className="rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar name={customer.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{customer.name}</p>
              <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                <Mail className="size-3" aria-hidden /> {customer.email}
              </p>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3" aria-hidden /> {customer.city}
          </p>
        </section>
      )}

      <section aria-labelledby="req-details">
        <h3 id="req-details" className="text-sm font-semibold">
          Requirements
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{request.requirements}</p>
        {request.notes && <p className="mt-2 text-sm text-muted-foreground">Note: {request.notes}</p>}
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Submitted</dt>
            <dd className="font-medium">{formatDate(request.createdAt)}</dd>
          </div>
          <div>
            <dt className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="size-3" aria-hidden /> Preferred date
            </dt>
            <dd className="font-medium">{request.preferredDate ? formatDate(request.preferredDate) : "Flexible"}</dd>
          </div>
        </dl>
      </section>

      <Separator />

      <section aria-labelledby="req-manage" className="space-y-4">
        <h3 id="req-manage" className="text-sm font-semibold">
          Manage request
        </h3>
        <div className="grid gap-2">
          <Label htmlFor="assignee">Assigned to</Label>
          <Select
            value={request.assignee ?? "Unassigned"}
            onValueChange={(v) => {
              assignRequest(request.id, v);
              toast.success(v === "Unassigned" ? "Request unassigned" : `Assigned to ${v}`);
            }}
          >
            <SelectTrigger id="assignee">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {staff.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="status">Update status</Label>
          <Select value={nextStatus} onValueChange={(v) => setNextStatus(v as RequestStatus)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(statusMeta) as RequestStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {statusMeta[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="note">
            Note to customer <span className="font-normal text-muted-foreground">(optional)</span>
          </Label>
          <Textarea id="note" rows={3} maxLength={300} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Technician confirmed for Thursday morning." />
        </div>
        <Button className="w-full" onClick={saveStatus} loading={saving} disabled={nextStatus === request.status && !note.trim()}>
          {!saving && <Send />} Save update
        </Button>
      </section>

      <Separator />

      <section aria-labelledby="req-timeline">
        <h3 id="req-timeline" className="mb-4 text-sm font-semibold">
          Timeline
        </h3>
        <RequestTimeline events={request.timeline} />
      </section>
    </div>
  );
}
