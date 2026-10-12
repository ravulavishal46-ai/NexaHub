"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/mock/services";
import { useDemoStore } from "@/lib/store/demo-store";
import { useZodForm } from "@/lib/use-zod-form";
import { formatCurrency, simulateLatency } from "@/lib/utils";
import { serviceSchema } from "@/lib/validation/schemas";
import type { CategoryId, PricingModel, Service } from "@/types";

const modelLabel: Record<PricingModel, string> = { fixed: "Fixed price", hourly: "Hourly rate", quote: "Custom quote" };

function pricingLabel(model: PricingModel, amount?: number) {
  if (model === "quote" || amount === undefined) return "Custom quote";
  return model === "hourly" ? `${formatCurrency(amount)} / hour` : `From ${formatCurrency(amount)}`;
}

export function ServiceFormDialog({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided the dialog edits this service; otherwise it creates one. */
  service?: Service;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        {/* Keyed so the form starts fresh each time it opens for a different service. */}
        {open && <ServiceForm key={service?.id ?? "new"} service={service} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function ServiceForm({ service, onDone }: { service?: Service; onDone: () => void }) {
  const { saveService } = useDemoStore();
  const form = useZodForm(serviceSchema, {
    name: service?.name ?? "",
    categoryId: service?.categoryId ?? "",
    shortDescription: service?.shortDescription ?? "",
    description: service?.description ?? "",
    pricingModel: service?.pricing.model ?? "fixed",
    amount: service?.pricing.amount?.toString() ?? "",
    duration: service?.duration ?? "",
  });
  const isQuote = form.values.pricingModel === "quote";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = form.validate();
    if (!data) return;
    const amount = isQuote ? undefined : Number(data.amount);
    if (!isQuote && (!data.amount || Number.isNaN(amount) || amount! <= 0)) {
      form.setErrors({ amount: "Enter an illustrative amount greater than 0." });
      document.getElementById("amount")?.focus();
      return;
    }
    form.setSubmitting(true);
    await simulateLatency(700);
    const saved = saveService({
      id: service?.id,
      name: data.name,
      categoryId: data.categoryId as CategoryId,
      icon: service?.icon ?? categories.find((c) => c.id === data.categoryId)?.icon ?? "sparkles",
      shortDescription: data.shortDescription,
      description: data.description,
      features: service?.features ?? ["Details confirmed during review"],
      process: service?.process ?? [
        { title: "Submit your request", description: "Describe what you need." },
        { title: "Review", description: "The team confirms scope and timing." },
        { title: "Delivery", description: "The service is carried out." },
      ],
      pricing: { model: data.pricingModel, amount, label: pricingLabel(data.pricingModel, amount) },
      duration: data.duration,
      isActive: service?.isActive ?? true,
      featured: service?.featured,
    });
    form.setSubmitting(false);
    toast.success(service ? `${saved.name} updated` : `${saved.name} created`, { description: "Saved in this browser (demo)." });
    onDone();
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <DialogHeader>
        <DialogTitle>{service ? "Edit service" : "Add a service"}</DialogTitle>
        <DialogDescription>
          {service ? "Update how this service appears in the catalog." : "New services appear in the catalog immediately (demo)."}
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Service name" error={form.errors.name}>
          <Input value={form.values.name} onChange={(e) => form.setField("name", e.target.value)} />
        </Field>
        <Field id="categoryId" label="Category" error={form.errors.categoryId}>
          {(p) => (
            <Select value={form.values.categoryId} onValueChange={(v) => form.setField("categoryId", v)}>
              <SelectTrigger {...p}>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      </div>
      <Field id="shortDescription" label="Short description" error={form.errors.shortDescription} hint="Shown on service cards.">
        <Input maxLength={120} value={form.values.shortDescription} onChange={(e) => form.setField("shortDescription", e.target.value)} />
      </Field>
      <Field id="description" label="Full description" error={form.errors.description}>
        <Textarea rows={3} value={form.values.description} onChange={(e) => form.setField("description", e.target.value)} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="pricingModel" label="Pricing model">
          {(p) => (
            <Select value={form.values.pricingModel} onValueChange={(v) => form.setField("pricingModel", v as PricingModel)}>
              <SelectTrigger {...p}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(modelLabel) as PricingModel[]).map((m) => (
                  <SelectItem key={m} value={m}>
                    {modelLabel[m]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
        <Field id="amount" label="Amount (USD)" error={form.errors.amount} hint={isQuote ? "Not needed for quotes." : "Illustrative only."}>
          <Input type="number" inputMode="decimal" min={1} disabled={isQuote} value={form.values.amount ?? ""} onChange={(e) => form.setField("amount", e.target.value)} />
        </Field>
        <Field id="duration" label="Typical duration" error={form.errors.duration}>
          <Input placeholder="e.g. 1–2 hours" value={form.values.duration} onChange={(e) => form.setField("duration", e.target.value)} />
        </Field>
      </div>
      <p className="text-xs text-muted-foreground">
        Pricing label preview:{" "}
        <span className="font-medium text-foreground">
          {pricingLabel(form.values.pricingModel, form.values.amount ? Number(form.values.amount) : undefined)}
        </span>
      </p>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" loading={form.submitting}>
          {service ? "Save changes" : "Create service"}
        </Button>
      </DialogFooter>
    </form>
  );
}
