import { WorkFilesCard } from "@/components/sandbox/WorkFilesCard";

export default function SandboxPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-white p-4 sm:p-8">
      <div className="flex w-full max-w-3xl flex-col items-center justify-center gap-8 sm:flex-row sm:gap-10">
        <WorkFilesCard variant="blue" />
        <WorkFilesCard variant="red" />
      </div>
    </main>
  );
}
