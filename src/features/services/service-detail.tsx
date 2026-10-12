"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CalendarClock, CheckCircle2, ChevronRight, Info, SearchX, Tag } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { ServiceIcon } from "@/components/shared/service-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getCategory } from "@/lib/mock/services";
import { useDemoStore } from "@/lib/store/demo-store";
import type { Service } from "@/types";
import { ServiceCard } from "./service-card";

const pricingCopy: Record<Service["pricing"]["model"], string> = {
  fixed: "Fixed starting price. The final amount is confirmed after review, before any work begins.",
  hourly: "Billed per hour on site. You'll receive an estimate of hours when your request is reviewed.",
  quote: "Priced to your needs. You'll receive a tailored quote after a short review of your request.",
};

export function ServiceDetail({ slug }: { slug: string }) {
  const { services } = useDemoStore();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
        <EmptyState
          icon={SearchX}
          title="Service not found"
          description="This service doesn't exist or is no longer listed."
          action={
            <Button asChild>
              <Link href="/services">Browse services</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const category = getCategory(service.categoryId);
  const related = [
    ...services.filter((s) => s.isActive && s.id !== service.id && s.categoryId === service.categoryId),
    ...services.filter((s) => s.isActive && s.id !== service.id && s.categoryId !== service.categoryId),
  ].slice(0, 3);
  const requestHref = `/dashboard/requests/new?service=${service.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <Link href="/services" className="hover:text-foreground">
              Services
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
          </li>
          <li className="flex items-center gap-1.5">
            <Link href={`/services?category=${service.categoryId}`} className="hover:text-foreground">
              {category?.name}
            </Link>
            <ChevronRight className="size-3.5" aria-hidden />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            {service.name}
          </li>
        </ol>
      </nav>

      {!service.isActive && (
        <div role="status" className="mt-6 flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm text-warning">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          This service is currently unavailable and can&apos;t be requested right now.
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
        <div className="min-w-0">
          <Reveal>
            <div className="flex items-center gap-4">
              <ServiceIcon icon={service.icon} category={service.categoryId} size="lg" />
              <Badge variant="outline" className="text-muted-foreground">
                {category?.name}
              </Badge>
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{service.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{service.description}</p>
          </Reveal>

          <section aria-labelledby="features-title" className="mt-14">
            <h2 id="features-title" className="text-xl font-semibold">
              What&apos;s included
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.features.map((f) => (
                <li key={f} className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="process-title" className="mt-14">
            <h2 id="process-title" className="text-xl font-semibold">
              Expected process
            </h2>
            <ol className="mt-6 space-y-0">
              {service.process.map((step, i) => (
                <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
                  {i < service.process.length - 1 && (
                    <span className="absolute top-9 bottom-0 left-[17px] w-px bg-border" aria-hidden />
                  )}
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card font-mono text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Sample pricing</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">{service.pricing.label}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pricingCopy[service.pricing.model]}</p>
            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="size-4" aria-hidden /> Pricing model
                </dt>
                <dd className="font-medium capitalize">{service.pricing.model === "quote" ? "Custom quote" : service.pricing.model}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-2 text-muted-foreground">
                  <CalendarClock className="size-4" aria-hidden /> Typical duration
                </dt>
                <dd className="font-medium">{service.duration}</dd>
              </div>
            </dl>
            <div className="mt-6 grid gap-2">
              {service.isActive ? (
                <Button size="lg" asChild>
                  <Link href={requestHref}>
                    Request Service <ArrowRight />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" disabled>
                  Currently unavailable
                </Button>
              )}
              <Button variant="ghost" asChild>
                <Link href="/services">
                  <ArrowLeft /> Back to services
                </Link>
              </Button>
            </div>
            <p className="mt-4 flex gap-2 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              Prototype: prices are illustrative and no payment is taken.
            </p>
          </Card>
        </aside>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-20 border-t border-border pt-14">
          <h2 id="related-title" className="text-2xl font-semibold tracking-tight">
            Related services
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
