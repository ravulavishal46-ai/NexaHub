"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, ArrowDown, Clock, Info, Minus, Send } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceIcon } from "@/components/shared/service-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getCategory } from "@/lib/mock/services";
import { useDemoStore } from "@/lib/store/demo-store";
import { useZodForm } from "@/lib/use-zod-form";
import { cn, simulateLatency } from "@/lib/utils";
import { serviceRequestSchema } from "@/lib/validation/schemas";
import type { RequestPriority } from "@/types";

const priorities: { value: RequestPriority; label: string; hint: string; icon: typeof ArrowUp }[] = [
  { value: "low", label: "Low", hint: "Flexible timing", icon: ArrowDown },
  { value: "normal", label: "Normal", hint: "Within a few days", icon: Minus },
  { value: "high", label: "High", hint: "As soon as possible", icon: ArrowUp },
];

export function NewRequestForm() {
  const serviceSlug = useSearchParams().get("service") ?? "";
  // Re-create the form when the chosen service in the URL changes, because
  // Next.js keeps recently visited pages (and their state) alive.
  return <RequestForm key={serviceSlug} serviceSlug={serviceSlug} />;
}

function RequestForm({ serviceSlug }: { serviceSlug: string }) {
  const router = useRouter();
  const { services, createRequest } = useDemoStore();
  const active = services.filter((s) => s.isActive);
  const preselected = active.find((s) => s.slug === serviceSlug);

  const form = useZodForm(serviceRequestSchema, {
    serviceId: preselected?.id ?? "",
    requirements: "",
    preferredDate: "",
    notes: "",
    priority: "normal",
  });
  const selected = active.find((s) => s.id === form.values.serviceId);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = form.validate();
    if (!data) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    form.setSubmitting(true);
    await simulateLatency(900);
    const request = createRequest(data);
    form.setSubmitting(false);
    form.reset();
    toast.success(`Request ${request.id} submitted`, {
      description: "Saved in this browser only (demo).",
    });
    router.push(`/dashboard/requests/${request.id}`);
  }

  const reqLength = form.values.requirements.length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="New service request"
        description="Tell us what you need. You can track the request from your dashboard once it's submitted."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <form onSubmit={onSubmit} noValidate className="grid gap-6 p-5 sm:p-7">
            <Field id="serviceId" label="Service" error={form.errors.serviceId}>
              {(p) => (
                <Select value={form.values.serviceId} onValueChange={(v) => form.setField("serviceId", v)}>
                  <SelectTrigger {...p} className="h-11">
                    <SelectValue placeholder="Choose a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {active.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </Field>

            <Field
              id="requirements"
              label="Describe your requirements"
              error={form.errors.requirements}
              hint="What needs doing, where, and anything we should know. At least 20 characters."
            >
              <Textarea
                rows={6}
                maxLength={1000}
                placeholder="e.g. The kitchen tap is leaking at the base and water is collecting under the sink…"
                value={form.values.requirements}
                onChange={(e) => form.setField("requirements", e.target.value)}
              />
            </Field>
            <p className="-mt-4 text-right text-xs text-muted-foreground tabular-nums" aria-live="polite">
              {reqLength}/1000
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="preferredDate" label="Preferred date" optional error={form.errors.preferredDate}>
                <Input
                  type="date"
                  value={form.values.preferredDate}
                  onChange={(e) => form.setField("preferredDate", e.target.value)}
                />
              </Field>
              <fieldset className="grid gap-2">
                <legend className="mb-2 text-sm font-medium">Priority</legend>
                <div className="grid grid-cols-3 gap-2">
                  {priorities.map((p) => {
                    const checked = form.values.priority === p.value;
                    return (
                      <label
                        key={p.value}
                        className={cn(
                          "flex cursor-pointer flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-center text-sm transition-colors has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/40",
                          checked ? "border-primary bg-primary/5 text-foreground" : "border-border bg-card text-muted-foreground hover:border-foreground/20",
                        )}
                      >
                        <input
                          type="radio"
                          name="priority"
                          value={p.value}
                          checked={checked}
                          onChange={() => form.setField("priority", p.value)}
                          className="sr-only"
                        />
                        <span className="flex items-center gap-1 font-medium">
                          <p.icon className="size-3.5" aria-hidden /> {p.label}
                        </span>
                        <span className="text-[11px] leading-tight">{p.hint}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>

            <Field id="notes" label="Additional notes" optional error={form.errors.notes} hint="Access instructions, parking, best time to call…">
              <Textarea rows={3} maxLength={500} value={form.values.notes} onChange={(e) => form.setField("notes", e.target.value)} />
            </Field>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Button variant="ghost" asChild>
                <Link href="/dashboard/requests">Cancel</Link>
              </Button>
              <Button type="submit" size="lg" loading={form.submitting}>
                {!form.submitting && <Send />}
                {form.submitting ? "Submitting…" : "Submit request"}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Selected service</CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? (
                <div>
                  <div className="flex items-center gap-3">
                    <ServiceIcon icon={selected.icon} category={selected.categoryId} />
                    <div>
                      <p className="font-semibold">{selected.name}</p>
                      <p className="text-xs text-muted-foreground">{getCategory(selected.categoryId)?.name}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{selected.shortDescription}</p>
                  <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Sample pricing</dt>
                      <dd className="font-medium">{selected.pricing.label}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="size-3.5" aria-hidden /> Duration
                      </dt>
                      <dd className="font-medium">{selected.duration}</dd>
                    </div>
                  </dl>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Choose a service to see its details here.</p>
              )}
            </CardContent>
          </Card>
          <Card className="bg-muted/40">
            <CardContent className="pt-5 sm:pt-6">
              <p className="text-sm font-semibold">What happens next</p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-4 text-sm text-muted-foreground">
                <li>Your request is created with status Pending.</li>
                <li>The team reviews it and moves it In progress.</li>
                <li>You get a notification at every update.</li>
              </ol>
              <p className="mt-4 flex gap-2 text-xs text-muted-foreground">
                <Info className="mt-px size-3.5 shrink-0" aria-hidden />
                Prototype: requests are stored only in this browser.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function NewRequestSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading form">
      <Skeleton className="h-9 w-72" />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Skeleton className="h-[560px] rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}
