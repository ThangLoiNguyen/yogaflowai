import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, TrendingUp, HeartHandshake } from "lucide-react";

export interface TeacherAnalyticsData {
  activeStudents: number;
  avgAttendance: number;
  progressionRate: number;
  retention: number;
}

interface Props {
  data: TeacherAnalyticsData;
  compact?: boolean;
}

export function TeacherAnalytics({ data, compact }: Props) {
  const items = [
    {
      label: "Học viên hoạt động",
      value: data.activeStudents,
      suffix: "",
      hint: "+14 tháng này",
      icon: Users,
      color: "bg-sky-500",
      lightBg: "bg-sky-50",
      textColor: "text-sky-600"
    },
    {
      label: "Buổi tập tuần này",
      value: data.avgAttendance,
      suffix: "",
      hint: "Hoàn thành 7 ngày qua",
      icon: CheckCircle2,
      color: "bg-emerald-500",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
    {
      label: "Mức độ tiến bộ",
      value: data.progressionRate,
      suffix: "%",
      hint: "Chỉ số dẻo dai TB",
      icon: TrendingUp,
      color: "bg-indigo-500",
      lightBg: "bg-indigo-50",
      textColor: "text-indigo-600"
    },
    {
      label: "Số lớp quản lý",
      value: data.retention,
      suffix: "",
      hint: "Lớp học đang mở",
      icon: HeartHandshake,
      color: "bg-rose-500",
      lightBg: "bg-rose-50",
      textColor: "text-rose-600"
    },
  ];

  return (
    <div
      className={`grid gap-6 ${
        compact ? "md:grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="rounded-[2rem] border-slate-100 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-xl ${item.lightBg}`}>
                  <Icon className={`w-5 h-5 ${item.textColor}`} />
                </div>
                {!compact && (
                  <p className={`text-[10px] font-black uppercase tracking-widest ${item.textColor}`}>
                    {item.hint}
                  </p>
                )}
              </div>
              
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-black tracking-tight text-slate-900">
                    {item.value}
                  </p>
                  <span className="text-xs font-black text-slate-400">
                    {item.suffix}
                  </span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {item.label}
                </p>
              </div>
              
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-50">
                <div
                  className={`h-full rounded-full ${item.color} shadow-sm transition-all duration-1000 ease-out`}
                  style={{
                    width: `${Math.min(
                      100,
                      typeof item.value === "number" ? item.value : 100
                    )}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
