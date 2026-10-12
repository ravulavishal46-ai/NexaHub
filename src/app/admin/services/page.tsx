import type { Metadata } from "next";
import { ServicesManager } from "@/features/admin/services-manager";

export const metadata: Metadata = { title: "Services" };

export default function AdminServicesPage() {
  return <ServicesManager />;
}
