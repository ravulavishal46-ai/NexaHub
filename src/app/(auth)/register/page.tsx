import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a NexaHub account to request and track services.",
};

export default function Page() {
  return <RegisterForm />;
}
