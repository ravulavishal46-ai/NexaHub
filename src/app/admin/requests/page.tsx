import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RequestsManager } from "@/features/admin/requests-manager";

export const metadata: Metadata = { title: "Service Requests" };

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[600px] rounded-xl" />}>
      <RequestsManager />
    </Suspense>
  );
}
