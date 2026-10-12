"use client";

import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useDemoStore } from "@/lib/store/demo-store";
import { simulateLatency } from "@/lib/utils";

const initial = {
  platformName: "NexaHub",
  supportEmail: "support@nexahub.example",
  defaultPriority: "normal",
  allowRegistrations: true,
  notifyOnNewRequest: true,
  maintenanceNotice: false,
};

const toggles: { key: "allowRegistrations" | "notifyOnNewRequest" | "maintenanceNotice"; label: string; description: string }[] = [
  { key: "allowRegistrations", label: "Allow new registrations", description: "New visitors can create customer accounts." },
  { key: "notifyOnNewRequest", label: "Alert admins about new requests", description: "Send an alert when a request is submitted." },
  { key: "maintenanceNotice", label: "Show maintenance notice", description: "Display a banner on the public website." },
];

export function AdminSettings() {
  const { logAdminAction } = useDemoStore();
  const [values, setValues] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [emailError, setEmailError] = useState<string>();
  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(values.supportEmail)) {
      setEmailError("Enter a valid email address.");
      document.getElementById("supportEmail")?.focus();
      return;
    }
    setEmailError(undefined);
    setSaving(true);
    await simulateLatency(700);
    setSaved(values);
    setSaving(false);
    logAdminAction("Updated platform settings", "settings", "Platform settings");
    toast.success("Settings saved (demo)", { description: "Recorded in the activity log." });
  }

  return (
    <form onSubmit={save} noValidate className="space-y-6">
      <PageHeader
        title="Settings"
        description="Platform-wide configuration. Changes in this prototype stay in this page session."
        actions={
          <>
            <Button type="button" variant="ghost" disabled={!dirty || saving} onClick={() => setValues(saved)}>
              Discard
            </Button>
            <Button type="submit" loading={saving} disabled={!dirty}>
              Save settings
            </Button>
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Basic details shown to customers.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field id="platformName" label="Platform name">
            <Input value={values.platformName} onChange={(e) => setValues({ ...values, platformName: e.target.value })} />
          </Field>
          <Field id="supportEmail" label="Support email" error={emailError} hint="Fictional example address.">
            <Input type="email" value={values.supportEmail} onChange={(e) => setValues({ ...values, supportEmail: e.target.value })} />
          </Field>
          <Field id="defaultPriority" label="Default request priority">
            {(p) => (
              <Select value={values.defaultPriority} onValueChange={(v) => setValues({ ...values, defaultPriority: v })}>
                <SelectTrigger {...p}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            )}
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Platform behaviour</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {toggles.map((t) => (
            <div key={t.key} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
              <div>
                <Label htmlFor={t.key}>{t.label}</Label>
                <p id={`${t.key}-desc`} className="mt-1 text-sm text-muted-foreground">
                  {t.description}
                </p>
              </div>
              <Switch
                id={t.key}
                aria-describedby={`${t.key}-desc`}
                checked={values[t.key]}
                onCheckedChange={(v) => setValues({ ...values, [t.key]: v })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-teal" aria-hidden /> Roles &amp; access (planned)
          </CardTitle>
          <CardDescription>How admin access will be secured when the backend is added.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {[
              "Every new account is created with the standard user role — nobody can make themselves an admin.",
              "Admin pages and APIs re-check the role on the server for every request.",
              "Row Level Security in Supabase limits each user to their own records.",
              "Sensitive admin actions are written to an append-only audit log.",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </form>
  );
}
