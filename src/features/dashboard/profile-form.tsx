"use client";

import { useEffect } from "react";
import { Info, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useDemoStore, useMyRequests } from "@/lib/store/demo-store";
import { useZodForm } from "@/lib/use-zod-form";
import { formatDate, simulateLatency } from "@/lib/utils";
import { profileSchema } from "@/lib/validation/schemas";

export function ProfileForm() {
  const { currentUser, updateProfile, hydrated } = useDemoStore();
  const mine = useMyRequests();
  const form = useZodForm(profileSchema, {
    name: currentUser.name,
    phone: currentUser.phone ?? "",
    city: currentUser.city,
  });
  const { reset } = form;

  // Once saved demo data loads from this browser, show it in the form.
  useEffect(() => {
    if (hydrated) reset({ name: currentUser.name, phone: currentUser.phone ?? "", city: currentUser.city });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when hydration completes
  }, [hydrated]);

  const dirty =
    form.values.name !== currentUser.name ||
    form.values.phone !== (currentUser.phone ?? "") ||
    form.values.city !== currentUser.city;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = form.validate();
    if (!data) return;
    form.setSubmitting(true);
    await simulateLatency(700);
    updateProfile({ name: data.name, phone: data.phone || undefined, city: data.city });
    form.setSubmitting(false);
    toast.success("Profile updated (demo)");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage the personal details shown on your requests." />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="items-center p-6 text-center">
          <Avatar name={currentUser.name} className="size-20 text-xl" />
          <h2 className="mt-4 text-lg font-semibold">{currentUser.name}</h2>
          <p className="text-sm text-muted-foreground">{currentUser.email}</p>
          <Badge variant="muted" className="mt-3">
            <ShieldCheck aria-hidden /> Standard user
          </Badge>
          <dl className="mt-6 grid w-full grid-cols-2 gap-3 border-t border-border pt-5 text-sm">
            <div>
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="mt-0.5 font-medium">{formatDate(currentUser.joinedAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Requests</dt>
              <dd className="mt-0.5 font-medium">{mine.length}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal information</CardTitle>
            <CardDescription>Only you and authorised administrators can see these details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} noValidate className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Full name" error={form.errors.name}>
                  <Input autoComplete="name" value={form.values.name} onChange={(e) => form.setField("name", e.target.value)} />
                </Field>
                <Field id="email" label="Email" hint="Email changes will require verification once real accounts exist.">
                  <Input type="email" value={currentUser.email} readOnly className="bg-muted text-muted-foreground" />
                </Field>
                <Field id="phone" label="Phone" optional error={form.errors.phone}>
                  <Input type="tel" autoComplete="tel" value={form.values.phone ?? ""} onChange={(e) => form.setField("phone", e.target.value)} />
                </Field>
                <Field id="city" label="City" error={form.errors.city}>
                  <Input autoComplete="address-level2" value={form.values.city} onChange={(e) => form.setField("city", e.target.value)} />
                </Field>
              </div>
              <div className="flex gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                <Info className="mt-px size-3.5 shrink-0" aria-hidden />
                Your role can&apos;t be changed here. Only administrators can grant elevated access.
              </div>
              <div className="flex justify-end gap-2 border-t border-border pt-5">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!dirty || form.submitting}
                  onClick={() => reset({ name: currentUser.name, phone: currentUser.phone ?? "", city: currentUser.city })}
                >
                  Discard changes
                </Button>
                <Button type="submit" loading={form.submitting} disabled={!dirty}>
                  Save changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
