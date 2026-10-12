"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useZodForm } from "@/lib/use-zod-form";
import { simulateLatency } from "@/lib/utils";
import { contactSchema } from "@/lib/validation/schemas";

const topics = ["General question", "Service availability", "Partnerships", "Feedback on the prototype"];

export function ContactForm() {
  const form = useZodForm(contactSchema, { name: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.validate()) return;
    form.setSubmitting(true);
    await simulateLatency();
    form.setSubmitting(false);
    setSent(true);
    toast.success("Message sent (demo)", { description: "Nothing was actually sent — this is a prototype." });
  }

  if (sent) {
    return (
      <div role="status" className="flex flex-col items-center py-10 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Thanks, {form.values.name.split(" ")[0]}!</h2>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          In the live product we&apos;d reply by email. In this prototype, your message was not sent or
          stored anywhere.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => {
            form.reset();
            setSent(false);
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" error={form.errors.name}>
          <Input autoComplete="name" value={form.values.name} onChange={(e) => form.setField("name", e.target.value)} />
        </Field>
        <Field id="email" label="Email" error={form.errors.email}>
          <Input type="email" autoComplete="email" value={form.values.email} onChange={(e) => form.setField("email", e.target.value)} />
        </Field>
      </div>
      <Field id="topic" label="Topic" error={form.errors.topic}>
        {(p) => (
          <Select value={form.values.topic} onValueChange={(v) => form.setField("topic", v)}>
            <SelectTrigger {...p}>
              <SelectValue placeholder="Choose a topic" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </Field>
      <Field id="message" label="Message" error={form.errors.message} hint="At least 20 characters.">
        <Textarea rows={5} value={form.values.message} onChange={(e) => form.setField("message", e.target.value)} />
      </Field>
      <Button type="submit" size="lg" loading={form.submitting} className="sm:w-fit">
        {!form.submitting && <Send />} Send message
      </Button>
      <p className="text-xs text-muted-foreground">Prototype form — messages are not sent or stored.</p>
    </form>
  );
}
