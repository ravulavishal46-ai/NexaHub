import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names safely (later classes win over earlier ones). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * A fixed "today" for the prototype. Using a constant instead of `new Date()`
 * keeps server and browser output identical and the demo data consistent.
 */
export const DEMO_NOW = new Date("2026-10-12T09:00:00Z");

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
});

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return `${dateTimeFormatter.format(new Date(iso))} UTC`;
}

export function formatRelative(iso: string, now: Date = DEMO_NOW) {
  const diff = now.getTime() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Pretend network latency so loading states are visible in the prototype. */
export function simulateLatency(ms = 700) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
