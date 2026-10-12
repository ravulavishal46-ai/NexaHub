import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceCatalog, ServiceCatalogSkeleton } from "@/features/services/service-catalog";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Browse NexaHub services across home repairs, cleaning, IT support, business services, moving and coaching.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold text-primary">Service catalog</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Find the right service</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Search, filter and compare services. Prices shown are illustrative examples for this
          prototype.
        </p>
      </header>
      <div className="mt-10">
        <Suspense fallback={<ServiceCatalogSkeleton />}>
          <ServiceCatalog />
        </Suspense>
      </div>
    </div>
  );
}
