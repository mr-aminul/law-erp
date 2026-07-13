import { Building2, Lock, Scale } from "lucide-react";

const trustPoints = [
  {
    icon: Building2,
    title: "One workspace per firm",
    description:
      "Your cases, clients, and staff stay inside your firm — never mixed with another practice.",
  },
  {
    icon: Lock,
    title: "Signed-in access only",
    description:
      "Every session is tied to a firm account and role before anything loads.",
  },
  {
    icon: Scale,
    title: "Built for legal ops",
    description: "Cases, clients, billing, and compliance in one console.",
  },
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="flex flex-col bg-sidebar px-8 py-10 text-white lg:px-12 lg:py-14">
        <div className="flex-1">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
              <Scale className="h-5 w-5 text-green" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green">
                UKIL.ai
              </p>
              <p className="font-heading text-base font-semibold leading-tight">
                Law Firm Console
              </p>
            </div>
          </div>

          <p className="text-xs font-medium uppercase tracking-wider text-green/90">
            Firm sign-in
          </p>
          <h1 className="mt-3 max-w-md font-heading text-3xl font-semibold leading-snug tracking-tight xl:text-[2rem]">
            Sign in to your firm&apos;s private workspace.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            This is not a public account page. Access is for members of a
            registered firm — partners, associates, and staff with an invite or
            owner account.
          </p>

          <ul className="mt-10 space-y-6">
            {trustPoints.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <Icon className="h-4 w-4 text-green" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/60">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 text-xs text-white/40">
          © {new Date().getFullYear()} UKIL.ai · Law ERP
        </p>
      </aside>

      <main className="flex flex-col justify-center bg-cream px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
