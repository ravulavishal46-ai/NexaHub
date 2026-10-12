"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parentPath, useNavigationHistory } from "@/lib/navigation-history";
import { cn } from "@/lib/utils";

/**
 * Small back arrow. Goes to the previous page in NexaHub without reloading,
 * so nothing on the page you return to is reset. If there is no previous page
 * (e.g. the link was opened directly) it goes one level up instead.
 */
export function BackButton({ className }: { className?: string }) {
  const router = useRouter();
  const history = useNavigationHistory();
  const current = history[history.length - 1];
  const canGoBack = history.length > 1;
  const fallback = current ? parentPath(current) : null;

  // Nothing to go back to on the home page, or before the page has loaded.
  if (!current || (!canGoBack && !fallback)) return null;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={cn("shrink-0 text-muted-foreground hover:text-foreground", className)}
      aria-label="Go back to the previous page"
      title="Back"
      onClick={() => (canGoBack ? router.back() : router.push(fallback!))}
    >
      <ArrowLeft className="size-[18px]" />
    </Button>
  );
}
