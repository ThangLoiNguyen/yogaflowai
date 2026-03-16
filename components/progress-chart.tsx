"use client";

import {
  AreaChart,
  Area,
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
    <div className="w-full h-full min-h-[300px] animate-soft-fade">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFlex" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorStrength" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
          <XAxis 
            dataKey="date" 
            stroke="#cbd5e1" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
            dy={10}
          />
          <YAxis 
            stroke="#cbd5e1" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(0,0,0,0.05)",
              borderRadius: 24,
              fontSize: 12,
              padding: '12px 16px',
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
              border: 'none',
            }}
            itemStyle={{ fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.05em' }}
            cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            content={({ payload }) => (
              <div className="flex gap-6 justify-end mb-8">
                {payload?.map((entry: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{entry.value === 'flexibility' ? 'Dẻo dai' : 'Sức mạnh'}</span>
                  </div>
                ))}
              </div>
            )}
          />
          <Area
            name="flexibility"
            type="monotone"
            dataKey="flexibility"
            stroke="#10b981"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorFlex)"
            activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
          />
          <Area
            name="strength"
            type="monotone"
            dataKey="strength"
            stroke="#6366f1"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorStrength)"
            activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
