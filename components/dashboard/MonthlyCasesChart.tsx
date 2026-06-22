"use client";

import { monthlyCasesData } from "@/lib/mock/data";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function MonthlyCasesChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={monthlyCasesData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="casesGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2d7a4f" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#2d7a4f" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#d4c9b0" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: "#8ca89e" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#8ca89e" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #d4c9b0",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="cases"
          stroke="none"
          fill="url(#casesGradient)"
        />
        <Line
          type="monotone"
          dataKey="cases"
          stroke="#2d7a4f"
          strokeWidth={2}
          dot={{ r: 4, fill: "#2d7a4f", strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
