"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="flex min-h-[60dvh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-danger-soft text-danger">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred while showing this page. You can try again.
      </p>
      <Button className="mt-6" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
