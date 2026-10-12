import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { ServiceIcon } from "@/components/shared/service-icon";
import { categories, services } from "@/lib/mock/services";
import { SectionHeading } from "./section-heading";

export function CategoriesSection() {
  return (
    <section aria-labelledby="categories-title" className="border-y border-border bg-card py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="categories-title"
          eyebrow="Popular categories"
          title="Start with what you need help with"
          description="Services are organised into clear categories, so you can go straight to the right place."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const count = services.filter((s) => s.categoryId === cat.id && s.isActive).length;
            return (
              <li key={cat.id} className="min-w-0">
                <Reveal delay={i * 0.05}>
                  <Link
                    href={`/services?category=${cat.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-background p-5 transition-all outline-none hover:border-primary/30 hover:bg-card hover:shadow-md hover:shadow-navy/[0.03] focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  >
                    <ServiceIcon icon={cat.icon} category={cat.id} />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{cat.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" aria-hidden />
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {count} {count === 1 ? "service" : "services"}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
