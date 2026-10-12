import * as React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  /** Extra content shown at the right of the label row (e.g. "Forgot password?"). */
  aside?: React.ReactNode;
  /**
   * The input element, or a function that receives the accessibility props
   * (useful for composite controls like <Select>, where the props go on the trigger).
   */
  children: React.ReactElement<ControlProps> | ((props: ControlProps) => React.ReactNode);
}

export interface ControlProps {
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

/**
 * Label + control + hint/error, wired together for screen readers:
 * the control gets `aria-invalid` and `aria-describedby` automatically.
 */
export function Field({ id, label, error, hint, optional, className, aside, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const controlProps: ControlProps = {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>
          {label}
          {optional && <span className="font-normal text-muted-foreground">(optional)</span>}
        </Label>
        {aside}
      </div>
      {typeof children === "function"
        ? children(controlProps)
        : React.cloneElement(children, controlProps)}
      {hint && !error && (
        <p id={hintId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-xs font-medium text-destructive">
          <AlertCircle className="size-3.5 shrink-0" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
