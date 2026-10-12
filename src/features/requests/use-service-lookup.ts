"use client";

import { useMemo } from "react";
import { useDemoStore } from "@/lib/store/demo-store";
import type { Service } from "@/types";

/** Fast lookup of services by id, e.g. to show a request's service name. */
export function useServiceLookup() {
  const { services } = useDemoStore();
  return useMemo(() => {
    const map = new Map<string, Service>(services.map((s) => [s.id, s]));
    return (id: string) => map.get(id);
  }, [services]);
}
