import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Point = { label: string; flexibility: number; stress: number };

export function ProgressChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="label" stroke="#64748b" fontSize={11} />
          <YAxis stroke="#64748b" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              borderColor: "#1e293b",
              borderRadius: 12,
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="flexibility"
            stroke="#22c55e"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="stress"
            stroke="#fb7185"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

