import Link from "next/link";
import { cn } from "@/lib/utils";

/** Text-based NexaHub wordmark with a simple geometric mark. */
export function Logo({
  href = "/",
  className,
  showWordmark = true,
}: {
  href?: string;
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        className,
      )}
      aria-label="NexaHub home"
    >
      <span
        aria-hidden
        className="relative flex size-8 items-center justify-center overflow-hidden rounded-[9px] bg-navy text-white shadow-sm ring-1 ring-white/10 dark:bg-white dark:text-navy"
      >
        <span className="text-[15px] leading-none font-bold tracking-tighter">N</span>
        <span className="absolute right-1 bottom-1 size-1.5 rounded-full bg-teal" />
      </span>
      {showWordmark && (
        <span className="text-[17px] font-semibold tracking-tight text-foreground">
          Nexa<span className="text-primary">Hub</span>
        </span>
      )}
    </Link>
  );
}
