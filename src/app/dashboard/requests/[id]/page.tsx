import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestDetailSkeleton, UserRequestDetail } from "@/features/dashboard/request-detail";

export async function generateMetadata({ params }: PageProps<"/dashboard/requests/[id]">): Promise<Metadata> {
  const { id } = await params;
  return { title: `Request ${id}` };
}

export default function RequestDetailPage({ params }: PageProps<"/dashboard/requests/[id]">) {
  return (
    <Suspense fallback={<RequestDetailSkeleton />}>
      {params.then(({ id }) => (
        <UserRequestDetail id={decodeURIComponent(id)} />
      ))}
    </Suspense>
  );
}
