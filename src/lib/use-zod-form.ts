"use client";

import { useState } from "react";
import type { z } from "zod";
import { fieldErrors } from "@/lib/validation/schemas";

/**
 * Tiny form helper: keeps values + errors, validates with a Zod schema.
 * Errors are re-checked as the user types once a field has shown an error.
 */
export function useZodForm<Values extends Record<string, unknown>, Output>(
  schema: z.ZodType<Output, Values>,
  initial: Values,
) {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function setField<K extends keyof Values>(key: K, value: Values[K]) {
    const next = { ...values, [key]: value } as Values;
    setValues(next);
    if (errors[key as string]) {
      const result = schema.safeParse(next);
      const nextErrors = result.success ? {} : fieldErrors(result.error);
      setErrors((prev) => {
        const copy = { ...prev };
        if (nextErrors[key as string]) copy[key as string] = nextErrors[key as string];
        else delete copy[key as string];
        return copy;
      });
    }
  }

  /** Returns parsed data when valid, otherwise sets errors and returns null. */
  function validate(): Output | null {
    const result = schema.safeParse(values);
    if (!result.success) {
      const errs = fieldErrors(result.error);
      setErrors(errs);
      // Move focus to the first invalid field for keyboard & screen-reader users.
      const first = Object.keys(errs)[0];
      if (first) document.getElementById(first)?.focus();
      return null;
    }
    setErrors({});
    return result.data;
  }

  function reset(next: Values = initial) {
    setValues(next);
    setErrors({});
  }

  return { values, errors, setField, setErrors, validate, submitting, setSubmitting, reset };
}
