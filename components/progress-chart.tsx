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
    <div className="w-full h-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
              borderColor: "#f1f5f9",
              borderRadius: 16,
              fontSize: 12,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)",
            }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend iconType="circle" />
          <Line
            name="Flexibility"
            type="monotone"
            dataKey="flexibility"
            stroke="#10b981"
            strokeWidth={4}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
          <Line
            name="Strength"
            type="monotone"
            dataKey="strength"
            stroke="#6366f1"
            strokeWidth={4}
            dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
