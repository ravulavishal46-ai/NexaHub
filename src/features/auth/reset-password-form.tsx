"use client";

import Link from "next/link";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { PasswordInput } from "@/components/ui/password-input";
import { useZodForm } from "@/lib/use-zod-form";
import { simulateLatency } from "@/lib/utils";
import { resetPasswordSchema } from "@/lib/validation/schemas";
import { AuthHeader } from "./auth-header";

export function ResetPasswordForm() {
  const form = useZodForm(resetPasswordSchema, { password: "", confirmPassword: "" });
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.validate()) return;
    form.setSubmitting(true);
    await simulateLatency();
    form.setSubmitting(false);
    form.reset();
    setDone(true);
  }

  if (done) {
    return (
      <div role="status">
        <span className="flex size-12 items-center justify-center rounded-xl bg-success-soft text-success">
          <ShieldCheck className="size-6" aria-hidden />
        </span>
        <AuthHeader
          title="Password updated"
          description="In the live product your password would now be changed. Nothing was stored in this prototype."
        />
        <Button asChild size="lg" className="w-full">
          <Link href="/login">Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <AuthHeader
        title="Set a new password"
        description="Use at least 8 characters, including a letter and a number."
      />
      <form onSubmit={onSubmit} noValidate className="grid gap-5">
        <Field id="password" label="New password" error={form.errors.password}>
          <PasswordInput
            autoComplete="new-password"
            value={form.values.password}
            onChange={(e) => form.setField("password", e.target.value)}
          />
        </Field>
        <Field id="confirmPassword" label="Confirm new password" error={form.errors.confirmPassword}>
          <PasswordInput
            autoComplete="new-password"
            value={form.values.confirmPassword}
            onChange={(e) => form.setField("confirmPassword", e.target.value)}
          />
        </Field>
        <Button type="submit" size="lg" loading={form.submitting}>
          Update password
        </Button>
      </form>
    </>
  );
}
