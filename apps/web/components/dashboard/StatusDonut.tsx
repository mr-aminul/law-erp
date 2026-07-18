"use client";

import { caseStatusChartData } from "@/lib/mock/data";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export function StatusDonut() {
  const total = caseStatusChartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col items-center gap-3">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={caseStatusChartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={2}
            dataKey="value"
          >
            {caseStatusChartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const data = payload[0].payload;
              const pct = ((data.value / total) * 100).toFixed(1);
              return (
                <div className="rounded-badge bg-sidebar px-3 py-2 text-xs text-on-sidebar shadow-lg">
                  <p className="font-semibold">{data.name}</p>
                  <p>
                    {data.value} cases ({pct}%)
                  </p>
                </div>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {caseStatusChartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-text-sec">{item.name}</span>
            <span className="font-semibold text-text-primary">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
