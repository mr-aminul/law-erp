"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Form";
import { Loader2, Scale } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className={
          light
            ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white"
            : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sidebar text-on-sidebar"
        }
      >
        <Scale className="h-5 w-5" />
      </div>
      <span
        className={
          light
            ? "text-lg font-bold tracking-tight text-white"
            : "text-lg font-bold tracking-tight text-text-primary"
        }
      >
        UKIL.ai
      </span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/** Mini console preview — glass shell over the brand pane */
function ConsolePreview() {
  return (
    <div
      className="relative mx-auto w-full max-w-[420px] select-none"
      aria-hidden
    >
      <div className="absolute -inset-6 rounded-[28px] bg-white/[0.04] blur-2xl" />

      <div className="relative flex h-[280px] gap-2 rounded-[18px] border border-white/15 bg-white/[0.06] p-2 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.45)] backdrop-blur-md xl:h-[300px]">
        {/* Sidebar stub */}
        <div className="flex w-[72px] shrink-0 flex-col gap-2 rounded-[14px] border border-white/10 bg-white/[0.06] p-2.5">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-active-nav/90 text-on-active-nav">
            <Scale className="h-4 w-4" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-8 rounded-md ${i === 1 ? "bg-active-nav/70" : "bg-white/10"}`}
            />
          ))}
          <div className="mt-auto h-8 rounded-md bg-white/10" />
        </div>

        {/* Main panel stub */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[14px] border border-white/10 bg-white/[0.06]">
          <div className="flex items-center gap-2 border-b border-white/15 px-3 py-2.5">
            <div className="h-2 w-2 rounded-full bg-theme-bright" />
            <div className="h-2.5 w-20 rounded-full bg-white/25" />
          </div>

          <div className="grid grid-cols-3 gap-2 p-3">
            {[
              { bar: "bg-status-completed", value: "12" },
              { bar: "bg-blue", value: "48" },
              { bar: "bg-amber", value: "7" },
            ].map((cell) => (
              <div
                key={cell.value}
                className="rounded-lg border border-white/15 bg-white/10 p-2.5"
              >
                <div className={`mb-2 h-1 w-6 rounded-full ${cell.bar}`} />
                <div className="h-4 w-8 rounded bg-white/35 text-[0px]">
                  {cell.value}
                </div>
                <div className="mt-1.5 h-1.5 w-10 rounded-full bg-white/20" />
              </div>
            ))}
          </div>

          <div className="mx-3 mb-3 min-h-0 flex-1 overflow-hidden rounded-lg border border-white/15 bg-white/[0.06]">
            <div className="flex border-b border-white/10 bg-white/10 px-2 py-1.5">
              <div className="h-1.5 w-12 rounded-full bg-white/40" />
              <div className="ml-3 h-1.5 w-16 rounded-full bg-white/25" />
              <div className="ml-3 h-1.5 w-10 rounded-full bg-white/25" />
            </div>
            {[0.9, 0.7, 0.85, 0.55].map((w, i) => (
              <div
                key={i}
                className="flex items-center gap-2 border-t border-white/10 px-2 py-2"
              >
                <div
                  className="h-1.5 rounded-full bg-white/25"
                  style={{ width: `${w * 40}%` }}
                />
                <div className="ml-auto h-1.5 w-8 rounded-full bg-white/15" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BrandPane() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 0% 0%, color-mix(in srgb, var(--color-theme-mid) 28%, transparent), transparent 55%), radial-gradient(70% 60% at 100% 100%, color-mix(in srgb, var(--color-theme) 40%, black), transparent 50%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent"
        aria-hidden
      />

      <div className="relative z-10">
        <BrandMark light />
      </div>

      <div className="relative z-10 mt-12 max-w-sm xl:mt-16">
        <h1 className="text-[2.5rem] font-bold leading-[1.1] tracking-tight text-white xl:text-[2.75rem]">
          Clarity for
          <br />
          every case.
        </h1>
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 items-center py-10">
        <ConsolePreview />
      </div>
    </>
  );
}

export function SignInView() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();

    // ponytail: mock gate until next-auth is wired
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!email) {
      setError("Enter your work email to continue.");
      setIsSubmitting(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  function handleGoogle() {
    // ponytail: UI only until OAuth is wired
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col bg-white lg:flex-row">
      <section className="relative hidden min-h-dvh w-[48%] min-w-0 flex-col overflow-hidden bg-sidebar px-10 py-10 text-on-sidebar lg:flex xl:w-1/2 xl:px-14 xl:py-12">
        <BrandPane />
      </section>

      <section className="flex w-full min-w-0 flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="w-full max-w-[360px]">
          <div className="mb-8 flex justify-center lg:mb-10">
            <BrandMark />
          </div>

          <header className="mb-6 text-center sm:mb-8">
            <h2 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
              Welcome back
            </h2>
            <p className="mt-1.5 text-sm text-text-sec">
              Sign in to your UKIL console
            </p>
          </header>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full gap-2.5 border-gray-200 bg-white font-medium text-text-primary hover:bg-cream-card"
            onClick={handleGoogle}
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="my-5 flex items-center gap-3 sm:my-6">
            <div className="h-px flex-1 bg-divider" />
            <span className="shrink-0 text-[10px] font-semibold tracking-[0.14em] text-text-muted uppercase">
              Or email
            </span>
            <div className="h-px flex-1 bg-divider" />
          </div>

          <form
            action="/"
            method="post"
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="username"
                enterKeyHint="done"
                required
                placeholder="you@chambers.com"
                className="h-11"
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "signin-error" : undefined}
              />
            </div>

            {error ? (
              <p
                id="signin-error"
                role="alert"
                aria-live="polite"
                className="text-xs text-red"
              >
                {error}
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full bg-sidebar text-on-sidebar hover:bg-sidebar-alt"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Continuing…
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-text-sec sm:mt-8">
            New to UKIL?{" "}
            <a
              href="#request-access"
              className="font-semibold text-green hover:underline"
            >
              Request access
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
