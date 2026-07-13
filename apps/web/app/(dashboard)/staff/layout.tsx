import { SubNavSection } from "@/components/layout/SubNavSection";
import { staffSubNav } from "@/lib/config/navigation";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubNavSection items={staffSubNav}>{children}</SubNavSection>;
}
