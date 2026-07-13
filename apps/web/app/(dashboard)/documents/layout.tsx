import { SubNavSection } from "@/components/layout/SubNavSection";
import { documentsSubNav } from "@/lib/config/navigation";

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubNavSection items={documentsSubNav}>{children}</SubNavSection>;
}
