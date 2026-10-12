import type { Metadata } from "next";
import { Suspense } from "react";
import { NewRequestForm, NewRequestSkeleton } from "@/features/dashboard/new-request-form";

export const metadata: Metadata = { title: "New Request" };

export default function NewRequestPage() {
  return (
    <Suspense fallback={<NewRequestSkeleton />}>
      <NewRequestForm />
    </Suspense>
  );
}
