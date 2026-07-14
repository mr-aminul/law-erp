import { Badge } from "@/components/ui/Badge";
import type { Communication } from "@/types/communication";
import { formatDate } from "@/lib/utils/formatDate";
import { Mail } from "lucide-react";

const channelVariant = (c: string) =>
  c === "Email" ? "blue" : c === "SMS" ? "green" : c === "Legal Notice" ? "amber" : "muted";

export function CommLogList({ items }: { items: Communication[] }) {
  return (
    <div className="space-y-2">
      {items.map((c) => (
        <div key={c.id} className="flex items-start gap-3 rounded-card border border-gray-200 px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-blue-light text-blue">
            <Mail className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">{c.subject}</span>
              <Badge variant={channelVariant(c.channel)}>{c.channel}</Badge>
              <Badge variant={c.status === "Delivered" ? "green" : c.status === "Failed" ? "red" : "amber"}>
                {c.status}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-text-sec">
              {c.clientName ?? "—"} · {c.caseName ?? "—"}
            </p>
            <p className="mt-1 text-[11px] text-text-muted">
              {formatDate(c.sentAt)} · {c.sentBy}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
