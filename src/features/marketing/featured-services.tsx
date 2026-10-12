import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/features/services/service-card";
import { services } from "@/lib/mock/services";
import { SectionHeading } from "./section-heading";

export function FeaturedServices() {
  const featured = services.filter((s) => s.featured && s.isActive).slice(0, 4);
  return (
    <section aria-labelledby="featured-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="featured-title"
            align="left"
            eyebrow="Featured services"
            title="Popular ways people get things done"
            description="A curated selection from the catalog. Every service shows what's included, how it works and an illustrative price before you request it."
          />
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/services">
              View all services <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((service, i) => (
            <Reveal key={service.id} delay={i * 0.06} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
