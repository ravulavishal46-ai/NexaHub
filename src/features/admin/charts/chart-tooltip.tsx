"use client";

/** Shared tooltip look for Recharts (text in ink colors, series shown by a swatch). */
export function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number | string; color?: string; dataKey?: string | number }[];
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg shadow-navy/10">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <ul className="space-y-0.5">
        {payload.map((p) => (
          <li key={String(p.dataKey)} className="flex items-center gap-2 text-muted-foreground">
            <span className="size-2 rounded-full" style={{ background: p.color }} aria-hidden />
            {p.name}
            <span className="ml-auto pl-3 font-medium text-foreground tabular-nums">{p.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
