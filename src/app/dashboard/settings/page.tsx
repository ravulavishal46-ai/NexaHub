import type { Metadata } from "next";
import { SettingsPanel } from "@/features/dashboard/settings-panel";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return <SettingsPanel />;
}
