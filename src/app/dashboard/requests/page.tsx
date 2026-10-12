import type { Metadata } from "next";
import { RequestsBrowser } from "@/features/dashboard/requests-browser";

export const metadata: Metadata = { title: "My Requests" };

export default function MyRequestsPage() {
  return <RequestsBrowser mode="requests" />;
}
