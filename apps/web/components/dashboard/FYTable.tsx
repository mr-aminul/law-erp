import { fyCaseReport } from "@/lib/mock/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

export function FYTable() {
  return (
    <Table compact>
      <TableHeader>
        <TableHead>Period</TableHead>
        <TableHead colSpan={2} className="text-center border-l border-divider">
          FY 2023
        </TableHead>
        <TableHead colSpan={2} className="text-center border-l border-divider">
          FY 2024
        </TableHead>
        <TableHead colSpan={2} className="text-center border-l border-divider">
          FY 2025
        </TableHead>
      </TableHeader>
      <tbody>
        <tr className="border-b border-divider text-[11px] text-text-muted">
          <td className="px-3 py-1" />
          <td className="border-l border-divider px-3 py-1 text-center">
            Pending
          </td>
          <td className="px-3 py-1 text-center">Completed</td>
          <td className="border-l border-divider px-3 py-1 text-center">
            Pending
          </td>
          <td className="px-3 py-1 text-center">Completed</td>
          <td className="border-l border-divider px-3 py-1 text-center">
            Pending
          </td>
          <td className="px-3 py-1 text-center">Completed</td>
        </tr>
      </tbody>
      <TableBody>
        {fyCaseReport.map((row) => (
          <TableRow key={row.period}>
            <TableCell className="font-semibold">{row.period}</TableCell>
            <TableCell className="text-center border-l border-divider text-amber">
              {row.fy2023.pending}
            </TableCell>
            <TableCell className="text-center text-green">
              {row.fy2023.completed}
            </TableCell>
            <TableCell className="text-center border-l border-divider text-amber">
              {row.fy2024.pending}
            </TableCell>
            <TableCell className="text-center text-green">
              {row.fy2024.completed}
            </TableCell>
            <TableCell className="text-center border-l border-divider text-amber">
              {row.fy2025.pending}
            </TableCell>
            <TableCell className="text-center text-green">
              {row.fy2025.completed}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
