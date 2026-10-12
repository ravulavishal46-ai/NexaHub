import type { Metadata } from "next";
import { SavedServices } from "@/features/dashboard/saved-services";

export const metadata: Metadata = { title: "Saved services" };

export default function SavedPage() {
  return <SavedServices />;
}
