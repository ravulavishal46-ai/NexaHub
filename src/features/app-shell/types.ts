import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Small count shown next to the label (e.g. unread notifications). */
  badge?: number;
  /** Match only the exact path (used for "Overview" links). */
  exact?: boolean;
}
