import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

type LoginPageProps = {
  searchParams?: { error?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const initialError = searchParams?.error
    ? decodeURIComponent(searchParams.error)
    : null;

  return (
    <AuthShell>
      <LoginForm initialError={initialError} />
    </AuthShell>
  );
}
