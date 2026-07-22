import { SubNavSection } from "@/components/layout/SubNavSection";
import { settingsSubNav } from "@/lib/config/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubNavSection items={settingsSubNav}>{children}</SubNavSection>;
}
