import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceDetail } from "@/features/services/service-detail";
import { getServiceBySlug, services } from "@/lib/mock/services";

/** Pre-build a page for every catalog service (fast, SEO-friendly). */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "Service" };
  return {
    title: service.name,
    description: service.shortDescription,
    openGraph: { title: `${service.name} · NexaHub`, description: service.shortDescription },
  };
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading service">
      <Skeleton className="h-4 w-60" />
      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="size-14 rounded-2xl" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}

export default function ServiceDetailPage({ params }: PageProps<"/services/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      {params.then(({ slug }) => (
        <ServiceDetail slug={slug} />
      ))}
    </Suspense>
  );
}
