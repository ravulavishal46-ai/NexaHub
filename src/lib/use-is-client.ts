"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only in the browser after hydration — use for values the server can't know (e.g. saved theme). */
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
