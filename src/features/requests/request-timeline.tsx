import { statusMeta } from "@/components/shared/status-badge";
import { cn, formatDateTime } from "@/lib/utils";
import type { RequestEvent } from "@/types";

const dot: Record<RequestEvent["status"], string> = {
  pending: "bg-warning-soft text-warning ring-warning/25",
  in_progress: "bg-info-soft text-info ring-info/25",
  completed: "bg-success-soft text-success ring-success/25",
  cancelled: "bg-neutral-soft text-neutral ring-neutral/25",
};

/** Vertical timeline of every status change, newest last. */
export function RequestTimeline({ events }: { events: RequestEvent[] }) {
  return (
    <ol className="relative">
      {events.map((event, i) => {
        const meta = statusMeta[event.status];
        const Icon = meta.icon;
        const last = i === events.length - 1;
        return (
          <li key={`${event.at}-${i}`} className="relative flex gap-4 pb-7 last:pb-0">
            {!last && <span className="absolute top-9 bottom-1 left-[15px] w-px bg-border" aria-hidden />}
            <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full ring-1", dot[event.status])}>
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-sm font-medium">
                {meta.label}
                {last && <span className="ml-2 text-xs font-normal text-muted-foreground">Latest</span>}
              </p>
              {event.note && <p className="mt-0.5 text-sm text-muted-foreground">{event.note}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                {formatDateTime(event.at)} · {event.by}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
