import type { Metadata } from "next";
import { SignInView } from "@/components/auth/SignInView";

export const metadata: Metadata = {
  title: "Sign in — UKIL.ai",
  description: "Sign in to the UKIL.ai law firm console",
};

export default function SignInPage() {
  return <SignInView />;
}
