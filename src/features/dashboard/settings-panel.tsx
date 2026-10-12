"use client";

import { useState } from "react";
import { Monitor, Moon, RotateCcw, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDemoStore, type Preferences } from "@/lib/store/demo-store";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/utils";

const prefRows: { key: keyof Preferences; label: string; description: string }[] = [
  { key: "statusAlerts", label: "Request status alerts", description: "Notify me when a request changes status." },
  { key: "emailUpdates", label: "Email summaries", description: "A weekly summary of open requests." },
  { key: "productNews", label: "Product news", description: "Occasional updates about new NexaHub features." },
];

export function SettingsPanel() {
  const { preferences, setPreferences, resetDemo } = useDemoStore();
  const { theme, setTheme } = useTheme();
  const isClient = useIsClient();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Choose how NexaHub looks and how we keep you informed." />

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Changes save instantly (stored in this browser for the demo).</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {prefRows.map((row) => (
            <div key={row.key} className="flex items-center justify-between gap-6 py-4 first:pt-0 last:pb-0">
              <div>
                <Label htmlFor={row.key}>{row.label}</Label>
                <p id={`${row.key}-desc`} className="mt-1 text-sm text-muted-foreground">
                  {row.description}
                </p>
              </div>
              <Switch
                id={row.key}
                aria-describedby={`${row.key}-desc`}
                checked={preferences[row.key]}
                onCheckedChange={(v) => {
                  setPreferences({ [row.key]: v });
                  toast.success(`${row.label} ${v ? "on" : "off"}`);
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Pick a theme or follow your device setting.</CardDescription>
        </CardHeader>
        <CardContent>
          <div role="radiogroup" aria-label="Theme" className="grid gap-3 sm:grid-cols-3">
            {[
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
              { value: "system", label: "System", icon: Monitor },
            ].map((opt) => {
              const active = isClient && theme === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTheme(opt.value)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
                    active ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20",
                  )}
                >
                  <opt.icon className={cn("size-4", active ? "text-primary" : "text-muted-foreground")} aria-hidden />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Demo data</CardTitle>
          <CardDescription>
            Everything you do in this prototype is stored only in this browser. Resetting restores the
            original sample data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setConfirmReset(true)}>
            <RotateCcw /> Reset demo data
          </Button>
        </CardContent>
      </Card>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset all demo data?</DialogTitle>
            <DialogDescription>
              Requests you created, profile edits and admin changes made in this browser will be
              replaced with the original sample data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Keep my data</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                resetDemo();
                setConfirmReset(false);
                toast.success("Demo data reset");
              }}
            >
              Reset data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
