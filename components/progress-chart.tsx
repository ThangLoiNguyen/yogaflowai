"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

type Point = { 
  date: string; 
  flexibility: number; 
  strength: number;
};

export function ProgressChart({ data }: { data: Point[] }) {
  return (
    <div className="w-full h-80 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(4px)",
              borderColor: "#e2e8f0",
              borderRadius: 16,
              fontSize: 12,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend iconType="circle" />
          <Line
            name="Flexibility"
            type="monotone"
            dataKey="flexibility"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            name="Strength"
            type="monotone"
            dataKey="strength"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
