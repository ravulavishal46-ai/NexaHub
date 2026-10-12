import {
  Briefcase,
  Building2,
  Calculator,
  Database,
  Globe,
  GraduationCap,
  Laptop,
  Plug,
  Sparkles,
  SprayCan,
  Truck,
  Wifi,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId, IconName } from "@/types";
import { cn } from "@/lib/utils";

const icons: Record<IconName, LucideIcon> = {
  wrench: Wrench,
  zap: Zap,
  plug: Plug,
  sparkles: Sparkles,
  building: Building2,
  laptop: Laptop,
  wifi: Wifi,
  database: Database,
  calculator: Calculator,
  globe: Globe,
  truck: Truck,
  briefcase: Briefcase,
  spray: SprayCan,
  graduation: GraduationCap,
};

/** Each category gets a calm tint so cards are easy to scan. */
const tints: Record<CategoryId, string> = {
  "home-repairs": "bg-blue-50 text-blue-700 ring-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:ring-blue-500/20",
  cleaning: "bg-teal-50 text-teal-700 ring-teal-100 dark:bg-teal-500/10 dark:text-teal-300 dark:ring-teal-500/20",
  "it-support": "bg-indigo-50 text-indigo-700 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-500/20",
  business: "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-500/15 dark:text-slate-200 dark:ring-slate-500/25",
  moving: "bg-sky-50 text-sky-700 ring-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:ring-sky-500/20",
  coaching: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20",
};

export function ServiceIcon({
  icon,
  category,
  className,
  size = "md",
}: {
  icon: IconName;
  category: CategoryId;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = icons[icon] ?? Sparkles;
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
        size === "sm" && "size-8 rounded-lg [&_svg]:size-4",
        size === "md" && "size-11 [&_svg]:size-5",
        size === "lg" && "size-14 rounded-2xl [&_svg]:size-6",
        tints[category],
        className,
      )}
    >
      <Icon strokeWidth={1.75} />
    </span>
  );
}

export function getIcon(name: IconName) {
  return icons[name] ?? Sparkles;
}
