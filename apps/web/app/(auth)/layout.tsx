export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="auth-shell min-h-dvh min-w-0">{children}</div>;
}
