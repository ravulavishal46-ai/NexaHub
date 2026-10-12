import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary dark:bg-primary/15",
        outline: "border-border bg-card text-foreground",
        muted: "border-transparent bg-muted text-muted-foreground",
        success: "border-transparent bg-success-soft text-success",
        warning: "border-transparent bg-warning-soft text-warning",
        info: "border-transparent bg-info-soft text-info",
        danger: "border-transparent bg-danger-soft text-danger",
        neutral: "border-transparent bg-neutral-soft text-neutral",
        teal: "border-transparent bg-teal/10 text-teal dark:text-teal-300",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
