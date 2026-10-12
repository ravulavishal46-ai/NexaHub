import { z } from "zod";

/**
 * Form validation rules, shared by every form.
 * The same schemas will be reused on the server later, so the browser and the
 * API always agree on what valid input looks like.
 */

const email = z.email("Enter a valid email address.");

const password = z
  .string()
  .min(8, "Use at least 8 characters.")
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your full name."),
    email,
    password,
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v, "Please confirm you understand this is a prototype."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email,
  topic: z.string().min(1, "Choose a topic."),
  message: z.string().trim().min(20, "Tell us a little more (at least 20 characters)."),
});

export const serviceRequestSchema = z.object({
  serviceId: z.string().min(1, "Choose a service."),
  requirements: z
    .string()
    .trim()
    .min(20, "Describe your requirements in at least 20 characters.")
    .max(1000, "Keep it under 1000 characters."),
  preferredDate: z.string().optional(),
  notes: z.string().max(500, "Keep notes under 500 characters.").optional(),
  priority: z.enum(["low", "normal", "high"]),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{0,20}$/, "Use digits, spaces and + ( ) - only.")
    .optional(),
  city: z.string().trim().min(2, "Enter your city."),
});

export const serviceSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters."),
  categoryId: z.string().min(1, "Choose a category."),
  shortDescription: z.string().trim().min(10, "Add a short description (10+ characters)."),
  description: z.string().trim().min(20, "Add a full description (20+ characters)."),
  pricingModel: z.enum(["fixed", "hourly", "quote"]),
  amount: z.string().optional(),
  duration: z.string().trim().min(2, "Add an expected duration."),
});

/** Turn a Zod error into `{ fieldName: "first message" }` for forms. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
