import * as React from "react";
import { cn } from "@/lib/utils";

/** Tables scroll sideways inside their card on small screens — the page never overflows. */
function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto scrollbar-thin">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead className={cn("[&_tr]:border-b [&_tr]:hover:bg-transparent", className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b border-border transition-colors hover:bg-muted/50", className)}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle text-xs font-medium tracking-wide whitespace-nowrap text-muted-foreground uppercase first:pl-5 last:pr-5",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      className={cn("px-4 py-3 align-middle whitespace-nowrap first:pl-5 last:pr-5", className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<"caption">) {
  return <caption className={cn("sr-only", className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption };
