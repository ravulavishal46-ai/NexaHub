"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useDemoStore } from "@/lib/store/demo-store";
import { useZodForm } from "@/lib/use-zod-form";
import { cn, simulateLatency } from "@/lib/utils";
import { registerSchema } from "@/lib/validation/schemas";
import { AuthHeader } from "./auth-header";

function strength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}
const strengthLabel = ["Too short", "Weak", "Fair", "Good", "Strong"];

export function RegisterForm() {
  const router = useRouter();
  const { register } = useDemoStore();
  const form = useZodForm(registerSchema, {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const score = strength(form.values.password);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = form.validate();
    if (!data) return;
    form.setSubmitting(true);
    await simulateLatency(900);
    // Only the name and email are kept (in this browser) to personalise the demo.
    register(data.name, data.email);
    form.setSubmitting(false);
    form.reset();
    toast.success("Demo account ready", { description: "No real account was created." });
    router.push("/dashboard");
  }

  return (
    <>
      <AuthHeader
        title="Create your account"
        description={
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </>
        }
      />
      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        <Field id="name" label="Full name" error={form.errors.name}>
          <Input autoComplete="name" value={form.values.name} onChange={(e) => form.setField("name", e.target.value)} />
        </Field>
        <Field id="email" label="Email" error={form.errors.email}>
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.values.email}
            onChange={(e) => form.setField("email", e.target.value)}
          />
        </Field>
        <div className="grid gap-2">
          <Field id="password" label="Password" error={form.errors.password}>
            <PasswordInput
              autoComplete="new-password"
              value={form.values.password}
              onChange={(e) => form.setField("password", e.target.value)}
            />
          </Field>
          {form.values.password && (
            <div aria-live="polite">
              <div className="flex gap-1" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full bg-muted transition-colors",
                      i < score && (score <= 1 ? "bg-danger" : score === 2 ? "bg-warning" : "bg-success"),
                    )}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Password strength: <span className="font-medium text-foreground">{strengthLabel[score]}</span>
              </p>
            </div>
          )}
        </div>
        <Field id="confirmPassword" label="Confirm password" error={form.errors.confirmPassword}>
          <PasswordInput
            autoComplete="new-password"
            value={form.values.confirmPassword}
            onChange={(e) => form.setField("confirmPassword", e.target.value)}
          />
        </Field>
        <div className="grid gap-2">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              checked={form.values.terms}
              onCheckedChange={(v) => form.setField("terms", v === true)}
              aria-invalid={form.errors.terms ? true : undefined}
              aria-describedby={form.errors.terms ? "terms-error" : undefined}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="leading-snug font-normal text-muted-foreground">
              I understand this is a prototype and no real account will be created.
            </Label>
          </div>
          {form.errors.terms && (
            <p id="terms-error" className="text-xs font-medium text-destructive">
              {form.errors.terms}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" loading={form.submitting}>
          {form.submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        New accounts always start as standard users. Admin access can only be granted by an
        existing administrator.
      </p>
    </>
  );
}
