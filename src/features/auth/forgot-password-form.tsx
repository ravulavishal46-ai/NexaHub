"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/lib/use-zod-form";
import { simulateLatency } from "@/lib/utils";
import { forgotPasswordSchema } from "@/lib/validation/schemas";
import { AuthHeader } from "./auth-header";

export function ForgotPasswordForm() {
  const form = useZodForm(forgotPasswordSchema, { email: "" });
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.validate()) return;
    form.setSubmitting(true);
    await simulateLatency();
    form.setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div role="status">
        <span className="flex size-12 items-center justify-center rounded-xl bg-success-soft text-success">
          <MailCheck className="size-6" aria-hidden />
        </span>
        <AuthHeader
          title="Check your inbox"
          description={
            <>
              If an account exists for <span className="font-medium text-foreground">{form.values.email}</span>,
              a reset link would be sent. In this prototype no email is sent.
            </>
          }
        />
        <div className="grid gap-2">
          <Button asChild size="lg">
            <Link href="/reset-password">Open the reset screen (demo)</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">
              <ArrowLeft /> Back to sign in
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <AuthHeader
        title="Forgot your password?"
        description="Enter the email you signed up with and we'll send you a link to reset it."
      />
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
        <Button type="submit" size="lg" loading={form.submitting}>
          Send reset link
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/login">
            <ArrowLeft /> Back to sign in
          </Link>
        </Button>
      </form>
    </>
  );
}
