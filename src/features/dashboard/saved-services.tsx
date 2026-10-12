"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/features/services/service-card";
import { useDemoStore } from "@/lib/store/demo-store";

export function SavedServices() {
  const { services, savedServiceIds, hydrated } = useDemoStore();
  const saved = savedServiceIds
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const unavailable = saved.filter((s) => !s.isActive).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved services"
        description="Services you've saved with the heart button, ready to request when you need them."
        actions={
          <Button variant="outline" asChild>
            <Link href="/dashboard/services">Browse services</Link>
          </Button>
        }
      />
      {!hydrated ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-2xl" />
          ))}
        </div>
      ) : saved.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No saved services yet"
          description="Tap the heart on any service card to keep it here for later."
          action={
            <Button asChild>
              <Link href="/dashboard/services">Find a service</Link>
            </Button>
          }
        />
      ) : (
        <>
          {unavailable > 0 && (
            <p className="text-sm text-muted-foreground">
              {unavailable} saved {unavailable === 1 ? "service is" : "services are"} currently unavailable.
            </p>
          )}
          <h2 className="sr-only">Saved services list</h2>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((s) => (
              <li key={s.id}>
                <ServiceCard service={s} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
