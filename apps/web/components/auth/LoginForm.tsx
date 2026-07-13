"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchGoogleAuthEnabled, login } from "@/lib/auth/client";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type LoginFormProps = {
  initialError?: string | null;
};

export function LoginForm({ initialError = null }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true);

  useEffect(() => {
    fetchGoogleAuthEnabled()
      .then(setGoogleEnabled)
      .finally(() => setGoogleLoading(false));
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-panel border border-divider/80 bg-white/95 p-8 shadow-[0_8px_30px_rgba(26,92,69,0.08)] backdrop-blur-sm sm:p-10">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-text-primary">
          Welcome back
        </h2>
        <p className="mt-2 text-sm text-text-muted">
          Use your work Google account or firm email and password.
        </p>
      </div>

      <div className="space-y-6">
        <GoogleSignInButton enabled={googleEnabled} loading={googleLoading} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-divider" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wide">
            <span className="bg-white px-3 text-text-muted">or email</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-text-primary"
            >
              Work email
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@yourfirm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-text-primary"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error ? (
            <div
              className="rounded-input border border-red/20 bg-red-light px-3 py-2.5 text-sm text-red"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <Button type="submit" className="h-11 w-full text-sm" disabled={loading}>
            {loading ? "Signing in…" : "Sign in with email"}
          </Button>
        </form>
      </div>

      {process.env.NODE_ENV === "development" ? (
        <p className="mt-6 border-t border-divider/60 pt-4 text-xs leading-relaxed text-text-muted">
          Dev: firm <strong>Law ERP Development</strong> · owner{" "}
          <strong>saif.alam@gmail.com</strong> · password{" "}
          <code className="rounded bg-cream-card px-1">DevPass123!</code>
        </p>
      ) : null}
    </div>
  );
}
