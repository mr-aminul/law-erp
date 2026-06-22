import { Badge } from "@/components/ui/Badge";
import { getStatusVariant } from "@/lib/utils/caseStatus";
import type { CaseStatus } from "@/types/case";

interface CaseStatusBadgeProps {
  status: CaseStatus;
}

export function CaseStatusBadge({ status }: CaseStatusBadgeProps) {
  return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
}
