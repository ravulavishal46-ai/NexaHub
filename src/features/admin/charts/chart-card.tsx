"use client";

import { useState, type ReactNode } from "react";
import { BarChart3, Table2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ChartTable {
  columns: string[];
  rows: (string | number)[][];
}

/**
 * Card wrapper for every chart: title, optional legend, and a
 * "View as table" toggle so the data is never available only as a picture.
 */
export function ChartCard({
  title,
  description,
  legend,
  table,
  children,
  className,
  readableContent = false,
}: {
  /** Set when the content is already readable text (not an SVG picture). */
  readableContent?: boolean;
  title: string;
  description?: string;
  legend?: ReactNode;
  table: ChartTable;
  children: ReactNode;
  className?: string;
}) {
  const [asTable, setAsTable] = useState(false);
  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription className="mt-1">{description}</CardDescription>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setAsTable((v) => !v)}
          aria-pressed={asTable}
          className="shrink-0 text-muted-foreground"
        >
          {asTable ? <BarChart3 /> : <Table2 />}
          {asTable ? "Chart" : "Table"}
          <span className="sr-only"> view of {title}</span>
        </Button>
      </CardHeader>
      <CardContent>
        {legend && !asTable && <div className="mb-3">{legend}</div>}
        {asTable ? (
          <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
            <Table>
              <TableCaption>{title}</TableCaption>
              <TableHeader>
                <TableRow>
                  {table.columns.map((c) => (
                    <TableHead key={c}>{c}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.rows.map((row, i) => (
                  <TableRow key={i}>
                    {row.map((cell, j) => (
                      <TableCell key={j} className={j > 0 ? "tabular-nums" : undefined}>
                        {cell}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : readableContent ? (
          children
        ) : (
          <div role="img" aria-label={`${title} chart. Use the Table button for the underlying data.`}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span className="h-0.5 w-4 rounded-full" style={{ background: i.color }} aria-hidden />
          {i.label}
        </li>
      ))}
    </ul>
  );
}
