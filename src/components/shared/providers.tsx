"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { PathTracker } from "@/components/navigation/path-tracker";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { DemoStoreProvider } from "@/lib/store/demo-store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <DemoStoreProvider>
          <PathTracker />
          {children}
          <Toaster />
        </DemoStoreProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
