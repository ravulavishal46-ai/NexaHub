import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  description: "Reset your NexaHub password.",
};

export default function Page() {
  return <ForgotPasswordForm />;
}
