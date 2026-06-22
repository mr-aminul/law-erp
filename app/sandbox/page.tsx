import { WorkFilesCard } from "@/components/sandbox/WorkFilesCard";

export default function SandboxPage() {
  return (
    <main className="min-h-screen bg-[#F0F0EE] flex items-center justify-center p-8">
      <div className="flex items-center gap-10">
        <WorkFilesCard variant="blue" />
        <WorkFilesCard variant="red" />
      </div>
    </main>
  );
}
