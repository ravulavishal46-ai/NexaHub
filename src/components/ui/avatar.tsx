import { cn, initials } from "@/lib/utils";

const tones = [
  "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200",
  "bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-200",
  "bg-slate-200 text-slate-800 dark:bg-slate-500/25 dark:text-slate-100",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-200",
];

/** Initials avatar — no photos, so no real faces are ever shown. */
function Avatar({ name, className }: { name: string; className?: string }) {
  const tone = tones[[...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % tones.length];
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        tone,
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}

export { Avatar };
