import { SubNavSection } from "@/components/layout/SubNavSection";
import { billingSubNav } from "@/lib/config/navigation";

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SubNavSection items={billingSubNav}>{children}</SubNavSection>;
}
