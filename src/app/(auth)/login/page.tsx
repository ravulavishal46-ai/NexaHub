import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your NexaHub account.",
};

export default function Page() {
  return <LoginForm />;
}
