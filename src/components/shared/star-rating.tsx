import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Read-only stars, with the number as text for screen readers. */
export function StarRating({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          aria-hidden
          className={cn("size-4", n <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40")}
        />
      ))}
      <span className="sr-only">{value} out of 5 stars</span>
    </span>
  );
}
