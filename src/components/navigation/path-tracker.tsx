"use client";

import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { recordPath } from "@/lib/navigation-history";

function Tracker() {
  const pathname = usePathname();
  useEffect(() => recordPath(pathname), [pathname]);
  return null;
}

/** Records each visited page for the back arrow. (Suspense: the URL is only known at request time.) */
export function PathTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
