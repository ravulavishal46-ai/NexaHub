import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceCatalog, ServiceCatalogSkeleton } from "@/features/services/service-catalog";

export const metadata: Metadata = { title: "Browse Services" };

export default function DashboardServicesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Services"
        description="Find a service and start a request in a couple of clicks. Prices are illustrative."
      />
      <Suspense fallback={<ServiceCatalogSkeleton />}>
        <ServiceCatalog />
      </Suspense>
    </div>
  );
}
