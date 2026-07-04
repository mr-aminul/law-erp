import { FolderCard } from "@/components/ui/FolderCard";
import { cn } from "@/lib/utils";

type WorkFilesCardVariant = "blue" | "red";

interface WorkFilesCardProps {
  variant?: WorkFilesCardVariant;
  title?: string;
  subtitle?: string;
  fileCount?: string;
  className?: string;
}

function parseFileCount(fileCount: string) {
  const match = fileCount.match(/^(.+?)\s+Files$/i);
  if (!match) return { count: fileCount, label: null as string | null };
  return { count: match[1], label: "Files" };
}

export function WorkFilesCard({
  variant = "blue",
  title = "Work files",
  subtitle = "Notes & More",
  fileCount = "2 386 Files",
  className,
}: WorkFilesCardProps) {
  const { count, label } = parseFileCount(fileCount);

  return (
    <FolderCard
      size="md"
      variant={variant}
      title={title}
      subtitle={subtitle}
      highlightValue={count}
      highlightLabel={label}
      className={cn("max-w-[288px]", className)}
    />
  );
}
