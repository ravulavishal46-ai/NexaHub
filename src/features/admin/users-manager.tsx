"use client";

import { useMemo, useState } from "react";
import { Ban, CalendarDays, Clock, Info, Mail, MapPin, Phone, RotateCcw, Search, ShieldCheck, UserRound, UserX } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { AccountStatusBadge, StatusBadge } from "@/components/shared/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useServiceLookup } from "@/features/requests/use-service-lookup";
import { useDemoStore } from "@/lib/store/demo-store";
import { formatDate, formatRelative } from "@/lib/utils";
import type { AccountStatus, UserProfile } from "@/types";

const PAGE_SIZE = 8;

export function UsersManager() {
  const { users, requests, hydrated, setUserStatus } = useDemoStore();
  const getService = useServiceLookup();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | AccountStatus>("all");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<UserProfile | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users
      .filter((u) => status === "all" || u.status === status)
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.city.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [users, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const selected = users.find((u) => u.id === selectedId) ?? null;
  const selectedRequests = selected ? requests.filter((r) => r.userId === selected.id) : [];
  const requestCount = (id: string) => requests.filter((r) => r.userId === id).length;

  function applyStatusChange() {
    if (!confirm) return;
    const next: AccountStatus = confirm.status === "suspended" ? "active" : "suspended";
    setUserStatus(confirm.id, next);
    toast.success(`${confirm.name} ${next === "suspended" ? "suspended" : "reactivated"} (demo)`);
    setConfirm(null);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Authorised view of registered accounts. Only the details needed to support customers are shown."
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative sm:w-80">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              placeholder="Search name, email or city"
              aria-label="Search users"
              className="pl-9"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as typeof status);
              setPage(1);
            }}
          >
            <SelectTrigger className="sm:w-44" aria-label="Filter by account status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="invited">Invited</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!hydrated ? (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState icon={UserX} title="No users found" description="Try a different name, email or status." />
          </div>
        ) : (
          <>
            <Table>
              <TableCaption>Registered users</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} className="size-8" />
                        <div>
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{u.city}</TableCell>
                    <TableCell>
                      {u.role === "admin" ? <Badge variant="teal">Admin</Badge> : <Badge variant="muted">User</Badge>}
                    </TableCell>
                    <TableCell>
                      <AccountStatusBadge status={u.status} />
                    </TableCell>
                    <TableCell className="tabular-nums">{requestCount(u.id)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(u.joinedAt)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatRelative(u.lastActiveAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => setSelectedId(u.id)}>
                        View <span className="sr-only">{u.name}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination page={currentPage} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} label="users" />
          </>
        )}
      </Card>

      {/* Profile details */}
      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DialogContent className="max-w-xl">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <Avatar name={selected.name} className="size-14 text-base" />
                  <div>
                    <DialogTitle>{selected.name}</DialogTitle>
                    <DialogDescription className="mt-1 flex flex-wrap items-center gap-2">
                      <span>{selected.id}</span>
                      <AccountStatusBadge status={selected.status} />
                      {selected.role === "admin" && <Badge variant="teal">Admin</Badge>}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              <dl className="grid gap-4 rounded-xl border border-border p-4 text-sm sm:grid-cols-2">
                {[
                  [Mail, "Email", selected.email],
                  [Phone, "Phone", selected.phone ?? "Not provided"],
                  [MapPin, "City", selected.city],
                  [UserRound, "Role", selected.role === "admin" ? "Administrator" : "Standard user"],
                  [CalendarDays, "Joined", formatDate(selected.joinedAt)],
                  [Clock, "Last active", formatRelative(selected.lastActiveAt)],
                ].map(([Icon, label, value]) => {
                  const I = Icon as typeof Mail;
                  return (
                    <div key={label as string}>
                      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <I className="size-3.5" aria-hidden /> {label as string}
                      </dt>
                      <dd className="mt-0.5 font-medium break-all">{value as string}</dd>
                    </div>
                  );
                })}
              </dl>
              <div>
                <h3 className="text-sm font-semibold">Recent requests ({selectedRequests.length})</h3>
                {selectedRequests.length === 0 ? (
                  <p className="mt-2 text-sm text-muted-foreground">No requests yet.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-border rounded-xl border border-border">
                    {selectedRequests.slice(0, 4).map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                        <span className="min-w-0 truncate">
                          <span className="font-mono text-xs text-muted-foreground">{r.id}</span>{" "}
                          {getService(r.serviceId)?.name}
                        </span>
                        <StatusBadge status={r.status} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <p className="flex gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                <Info className="mt-px size-3.5 shrink-0" aria-hidden />
                Role changes aren&apos;t available here. In production they will only be possible
                through protected server-side admin APIs.
              </p>
              <DialogFooter>
                {selected.role !== "admin" &&
                  (selected.status === "suspended" ? (
                    <Button variant="outline" onClick={() => setConfirm(selected)}>
                      <RotateCcw /> Reactivate account
                    </Button>
                  ) : (
                    <Button variant="outline" className="text-destructive hover:text-destructive" onClick={() => setConfirm(selected)}>
                      <Ban /> Suspend account
                    </Button>
                  ))}
                <Button onClick={() => setSelectedId(null)}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation for suspend / reactivate */}
      <Dialog open={Boolean(confirm)} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirm?.status === "suspended" ? "Reactivate" : "Suspend"} {confirm?.name}?
            </DialogTitle>
            <DialogDescription>
              {confirm?.status === "suspended"
                ? "They will be able to sign in and submit requests again."
                : "They won't be able to sign in or submit requests until reactivated. This action is recorded in the activity log."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(null)}>
              Cancel
            </Button>
            <Button variant={confirm?.status === "suspended" ? "default" : "destructive"} onClick={applyStatusChange}>
              {confirm?.status === "suspended" ? (
                <>
                  <ShieldCheck /> Reactivate
                </>
              ) : (
                <>
                  <Ban /> Suspend
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
