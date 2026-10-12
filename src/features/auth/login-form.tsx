"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useDemoStore } from "@/lib/store/demo-store";
import { useZodForm } from "@/lib/use-zod-form";
import { simulateLatency } from "@/lib/utils";
import { loginSchema } from "@/lib/validation/schemas";
import { AuthHeader } from "./auth-header";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useDemoStore();
  const form = useZodForm(loginSchema, { email: "", password: "" });
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const data = form.validate();
    if (!data) return;
    form.setSubmitting(true);
    await simulateLatency(800);
    // Demo-only: shows what a failed sign-in looks like. No password is checked or stored.
    if (data.password === "wrongpassword") {
      form.setSubmitting(false);
      setFormError("That email and password combination didn't match. Please try again.");
      return;
    }
    signIn();
    form.setSubmitting(false);
    form.reset();
    toast.success("Signed in to the demo");
    router.push("/dashboard");
  }

  return (
    <>
      <AuthHeader
        title="Welcome back"
        description={
          <>
            New to NexaHub?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </>
        }
      />
      <div className="mb-6 flex gap-2.5 rounded-lg border border-info/20 bg-info-soft p-3 text-xs text-info">
        <Info className="mt-px size-4 shrink-0" aria-hidden />
        <p>
          Demo: any valid email and password will sign you in. Use the password{" "}
          <code className="font-mono font-semibold">wrongpassword</code> to preview the error state.
        </p>
      </div>
      {formError && (
        <div role="alert" className="mb-5 flex gap-2.5 rounded-lg border border-destructive/25 bg-danger-soft p-3 text-sm text-danger">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          {formError}
        </div>
      )}
      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        <Field id="email" label="Email" error={form.errors.email}>
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.values.email}
            onChange={(e) => form.setField("email", e.target.value)}
          />
        </Field>
        <Field
          id="password"
          label="Password"
          error={form.errors.password}
          aside={
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            autoComplete="current-password"
            value={form.values.password}
            onChange={(e) => form.setField("password", e.target.value)}
          />
        </Field>
        <div className="flex items-center gap-2.5">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="font-normal text-muted-foreground">
            Keep me signed in on this device
          </Label>
        </div>
        <Button type="submit" size="lg" loading={form.submitting}>
          {form.submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Exploring the admin side?{" "}
        <Link href="/admin" className="font-medium text-primary hover:underline">
          Open the admin UI prototype
        </Link>
      </p>
    </>
  );
}
