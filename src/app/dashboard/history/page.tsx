import type { Metadata } from "next";
import { RequestsBrowser } from "@/features/dashboard/requests-browser";

export const metadata: Metadata = { title: "Request History" };

export default function HistoryPage() {
  return <RequestsBrowser mode="history" />;
}
