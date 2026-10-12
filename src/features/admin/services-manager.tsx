"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, CircleOff, Eye, MoreHorizontal, Pencil, Plus, Power, PowerOff, Search, SearchX } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceIcon } from "@/components/shared/service-icon";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categories, getCategory } from "@/lib/mock/services";
import { useDemoStore } from "@/lib/store/demo-store";
import type { Service } from "@/types";
import { ServiceFormDialog } from "./service-form-dialog";

export function ServicesManager() {
  const { services, requests, hydrated, setServiceActive } = useDemoStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [state, setState] = useState<"all" | "active" | "inactive">("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | undefined>();
  const [toggling, setToggling] = useState<Service | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return services
      .filter((s) => category === "all" || s.categoryId === category)
      .filter((s) => state === "all" || (state === "active" ? s.isActive : !s.isActive))
      .filter((s) => !q || s.name.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q));
  }, [services, query, category, state]);

  const openRequests = (id: string) =>
    requests.filter((r) => r.serviceId === id && (r.status === "pending" || r.status === "in_progress")).length;

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Create, edit and deactivate services in the catalog. Deactivated services are hidden from customers but kept for history."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Add service
          </Button>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-border p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input type="search" placeholder="Search services" aria-label="Search services" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="md:w-52" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={state} onValueChange={(v) => setState(v as typeof state)}>
            <SelectTrigger className="md:w-40" aria-label="Filter by availability">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
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
            <EmptyState icon={SearchX} title="No services found" description="Adjust the filters or add a new service." action={<Button onClick={openCreate}><Plus /> Add service</Button>} />
          </div>
        ) : (
          <Table>
            <TableCaption>Service catalog</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Pricing label</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Open requests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((s) => (
                <TableRow key={s.id} className={s.isActive ? undefined : "bg-muted/40"}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ServiceIcon icon={s.icon} category={s.categoryId} size="sm" />
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="max-w-64 truncate text-xs text-muted-foreground">{s.shortDescription}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{getCategory(s.categoryId)?.name}</TableCell>
                  <TableCell className="font-medium">{s.pricing.label}</TableCell>
                  <TableCell className="text-muted-foreground">{s.duration}</TableCell>
                  <TableCell className="tabular-nums">{openRequests(s.id)}</TableCell>
                  <TableCell>
                    {s.isActive ? (
                      <Badge variant="success">
                        <CheckCircle2 aria-hidden /> Active
                      </Badge>
                    ) : (
                      <Badge variant="neutral">
                        <CircleOff aria-hidden /> Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${s.name}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onSelect={() => {
                            setEditing(s);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil /> Edit service
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/services/${s.slug}`}>
                            <Eye /> View public page
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant={s.isActive ? "destructive" : undefined} onSelect={() => setToggling(s)}>
                          {s.isActive ? <PowerOff /> : <Power />}
                          {s.isActive ? "Deactivate" : "Reactivate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <ServiceFormDialog open={formOpen} onOpenChange={setFormOpen} service={editing} />

      <Dialog open={Boolean(toggling)} onOpenChange={(o) => !o && setToggling(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {toggling?.isActive ? "Deactivate" : "Reactivate"} {toggling?.name}?
            </DialogTitle>
            <DialogDescription>
              {toggling?.isActive
                ? "Customers will no longer be able to find or request this service. Existing requests are not affected."
                : "The service will appear in the catalog again and can be requested."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToggling(null)}>
              Cancel
            </Button>
            <Button
              variant={toggling?.isActive ? "destructive" : "default"}
              onClick={() => {
                if (!toggling) return;
                setServiceActive(toggling.id, !toggling.isActive);
                toast.success(`${toggling.name} ${toggling.isActive ? "deactivated" : "reactivated"}`);
                setToggling(null);
              }}
            >
              {toggling?.isActive ? "Deactivate" : "Reactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
