import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { ServiceIcon } from "@/components/shared/service-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/lib/mock/services";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

interface ServiceCardProps {
  service: Service;
  /** Where "Request service" should go. */
  requestHref?: string;
  className?: string;
}

export function ServiceCard({ service, requestHref, className }: ServiceCardProps) {
  const category = getCategory(service.categoryId);
  const detailsHref = `/services/${service.slug}`;

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg hover:shadow-navy/[0.04] sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <ServiceIcon icon={service.icon} category={service.categoryId} />
        <Badge variant="outline" className="text-muted-foreground">
          {category?.name}
        </Badge>
      </div>

      <h3 className="mt-5 text-[17px] font-semibold tracking-tight">
        <Link
          href={detailsHref}
          className="rounded outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
          {service.name}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {service.shortDescription}
      </p>

      <div className="mt-5 flex items-center gap-4 text-sm">
        <span className="font-semibold">{service.pricing.label}</span>
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="size-3.5" aria-hidden />
          {service.duration}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">Illustrative pricing</p>

      <div className="relative z-10 mt-5 flex gap-2 border-t border-border pt-4">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link href={detailsHref}>
            View details
            <span className="sr-only">for {service.name}</span>
          </Link>
        </Button>
        <Button size="sm" asChild className="flex-1">
          <Link href={requestHref ?? `/dashboard/requests/new?service=${service.slug}`}>
            Request <ArrowUpRight />
            <span className="sr-only">{service.name}</span>
          </Link>
        </Button>
      </div>
    </article>
  );
}
