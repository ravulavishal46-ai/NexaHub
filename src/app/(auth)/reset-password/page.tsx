import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new NexaHub password.",
};

export default function Page() {
  return <ResetPasswordForm />;
}
