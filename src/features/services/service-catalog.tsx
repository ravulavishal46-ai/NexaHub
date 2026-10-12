"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SearchX, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { categories } from "@/lib/mock/services";
import { useDemoStore } from "@/lib/store/demo-store";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";
import { ServiceCard } from "./service-card";

type SortKey = "featured" | "name" | "price-asc" | "price-desc";

const sortLabels: Record<SortKey, string> = {
  featured: "Featured first",
  name: "Name (A–Z)",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

/** Services without a fixed amount (custom quote) sort last by price. */
const priceOf = (s: Service) => s.pricing.amount ?? Number.POSITIVE_INFINITY;

export function ServiceCatalog() {
  const { services } = useDemoStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") ?? "all";
  const [category, setCategory] = useState(
    categories.some((c) => c.id === initialCategory) ? initialCategory : "all",
  );
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const changeCategory = (value: string) => {
    setCategory(value);
    // Keep the URL shareable (e.g. /services?category=cleaning) without adding history entries.
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("category");
    else params.set("category", value);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = services.filter(
      (s) =>
        s.isActive &&
        (category === "all" || s.categoryId === category) &&
        (!q ||
          s.name.toLowerCase().includes(q) ||
          s.shortDescription.toLowerCase().includes(q) ||
          s.features.some((f) => f.toLowerCase().includes(q))),
    );
    return [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price-asc") return priceOf(a) - priceOf(b);
      if (sort === "price-desc") {
        // Custom quotes go last in both directions.
        const pa = a.pricing.amount ?? -1;
        const pb = b.pricing.amount ?? -1;
        return pb - pa;
      }
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.name.localeCompare(b.name);
    });
  }, [services, category, query, sort]);

  const hasFilters = query !== "" || category !== "all";
  const clearAll = () => {
    setQuery("");
    changeCategory("all");
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, e.g. “backup” or “cleaning”"
            aria-label="Search services"
            className="h-11 pl-9"
          />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="h-11 md:w-56" aria-label="Sort services">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(sortLabels) as SortKey[]).map((key) => (
              <SelectItem key={key} value={key}>
                {sortLabels[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category filter chips */}
      <div
        role="group"
        aria-label="Filter by category"
        className="scrollbar-thin -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {[{ id: "all", name: "All services" }, ...categories].map((c) => {
          const active = category === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => changeCategory(c.id)}
              aria-pressed={active}
              className={cn(
                "h-9 shrink-0 cursor-pointer rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
                active
                  ? "border-navy bg-navy text-white dark:border-white dark:bg-white dark:text-navy"
                  : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <p className="text-muted-foreground" aria-live="polite">
          {results.length} {results.length === 1 ? "service" : "services"} found
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X /> Clear filters
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <EmptyState
          className="mt-4"
          icon={SearchX}
          title="No services match your search"
          description="Try a different keyword or browse all categories."
          action={<Button variant="outline" onClick={clearAll}>Clear filters</Button>}
        />
      ) : (
        <motion.ul layout className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((service) => (
              <motion.li
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <ServiceCard service={service} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}

export function ServiceCatalogSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading services">
      <div className="flex flex-col gap-3 md:flex-row">
        <Skeleton className="h-11 flex-1" />
        <Skeleton className="h-11 md:w-56" />
      </div>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
