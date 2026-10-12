"use client";

import { useSyncExternalStore } from "react";

/**
 * Remembers the pages visited in this tab (in memory only), so the back arrow
 * knows whether there is a previous page inside NexaHub to return to.
 */
let stack: string[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function recordPath(pathname: string) {
  const last = stack[stack.length - 1];
  if (last === pathname) return;
  // Returning to the previous page (back arrow or browser back) pops instead of pushing.
  if (stack[stack.length - 2] === pathname) stack = stack.slice(0, -1);
  else stack = [...stack.slice(-49), pathname];
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const EMPTY: string[] = [];

export function useNavigationHistory() {
  return useSyncExternalStore(subscribe, () => stack, () => EMPTY);
}

/** The page one level up, used when there's no previous page (e.g. a link opened directly). */
export function parentPath(pathname: string) {
  if (pathname === "/") return null;
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return "/";
  return "/" + parts.slice(0, -1).join("/");
}
