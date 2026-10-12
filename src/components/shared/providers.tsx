"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { DemoStoreProvider } from "@/lib/store/demo-store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user">
        <DemoStoreProvider>
          {children}
          <Toaster />
        </DemoStoreProvider>
      </MotionConfig>
    </ThemeProvider>
  );
}
