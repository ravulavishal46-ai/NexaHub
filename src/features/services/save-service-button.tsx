"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/store/demo-store";
import { useIsClient } from "@/lib/use-is-client";
import { cn } from "@/lib/utils";

/** Heart toggle to save a service for later (stored in this browser for the demo). */
export function SaveServiceButton({
  serviceId,
  serviceName,
  variant = "icon",
  className,
}: {
  serviceId: string;
  serviceName: string;
  variant?: "icon" | "full";
  className?: string;
}) {
  const { savedServiceIds, toggleSavedService } = useDemoStore();
  // Saved items load from the browser, so only show the filled state after hydration.
  const isClient = useIsClient();
  const saved = isClient && savedServiceIds.includes(serviceId);

  function toggle() {
    const nowSaved = toggleSavedService(serviceId);
    toast.success(nowSaved ? `${serviceName} saved` : `${serviceName} removed from saved`, {
      description: nowSaved ? "Find it under Saved in your dashboard." : undefined,
    });
  }

  const icon = <Heart className={cn(saved && "fill-current")} aria-hidden />;

  if (variant === "full") {
    return (
      <Button variant="outline" onClick={toggle} aria-pressed={saved} className={cn(saved && "text-danger hover:text-danger", className)}>
        {icon}
        {saved ? "Saved" : "Save service"}
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${serviceName} from saved` : `Save ${serviceName}`}
      title={saved ? "Saved" : "Save"}
      className={cn(
        "relative z-10 flex size-8 cursor-pointer items-center justify-center rounded-full border border-border bg-card transition-colors outline-none hover:border-foreground/20 focus-visible:ring-[3px] focus-visible:ring-ring/40 [&_svg]:size-4",
        saved ? "text-danger" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {icon}
    </button>
  );
}
