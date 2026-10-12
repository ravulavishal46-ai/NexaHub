import type { Metadata } from "next";
import Link from "next/link";
import { Clock, HelpCircle, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContactForm } from "@/features/contact/contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the NexaHub team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <p className="text-sm font-semibold text-primary">Contact</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Let&apos;s talk</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Questions about services, feedback on the platform, or anything else — send us a note.
          </p>
          <ul className="mt-10 space-y-5">
            <li className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{siteConfig.contactEmail} (example address)</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <Clock className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium">Typical response</p>
                <p className="text-sm text-muted-foreground">Within one business day (once live)</p>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <HelpCircle className="size-5" aria-hidden />
              </span>
              <div>
                <p className="font-medium">Quick answers</p>
                <p className="text-sm text-muted-foreground">
                  Check the{" "}
                  <Link href="/#faq" className="font-medium text-primary hover:underline">
                    FAQ
                  </Link>{" "}
                  for common questions.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <Card className="p-6 sm:p-8">
          <ContactForm />
        </Card>
      </div>
    </div>
  );
}
