import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { formatDate } from "@/lib/utils/formatDate";
import type { Communication, MessageChannel } from "@/types/communication";
import { Mail, MessageSquare, ScrollText, Smartphone, type LucideIcon } from "lucide-react";

const channelVariant = (c: MessageChannel) =>
  c === "Email" ? "blue" : c === "SMS" ? "green" : c === "Legal Notice" ? "amber" : "muted";

const channelIcon: Record<MessageChannel, LucideIcon> = {
  Internal: MessageSquare,
  Email: Mail,
  SMS: Smartphone,
  "Legal Notice": ScrollText,
};

interface CommLogListProps {
  items: Communication[];
  emptyTitle?: string;
}

export function CommLogList({
  items,
  emptyTitle = "No messages found",
}: CommLogListProps) {
  if (items.length === 0) {
    return <EmptyState title={emptyTitle} />;
  }

  return (
    <Table>
      <TableHeader>
        <TableHead>Subject</TableHead>
        <TableHead>Channel</TableHead>
        <TableHead>Client / Case</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Sent</TableHead>
      </TableHeader>
      <TableBody>
        {items.map((c) => {
          const Icon = channelIcon[c.channel];
          return (
            <TableRow key={c.id}>
              <TableCell className="font-semibold">
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0 text-text-muted" />
                  {c.subject}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={channelVariant(c.channel)}>{c.channel}</Badge>
              </TableCell>
              <TableCell className="text-text-sec">
                {c.clientName ?? "—"} · {c.caseName ?? "—"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    c.status === "Delivered"
                      ? "green"
                      : c.status === "Failed"
                        ? "red"
                        : "amber"
                  }
                >
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell className="text-text-muted">
                {formatDate(c.sentAt)} · {c.sentBy}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
