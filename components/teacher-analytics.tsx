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
      lightBg: "bg-sky-50 dark:bg-sky-500/10",
      textColor: "text-sky-600 dark:text-sky-400"
    },
    {
      label: "Tỷ lệ chuyên cần",
      value: data.avgAttendance,
      suffix: "%",
      hint: "Trung bình khóa hàng tuần",
      icon: CheckCircle2,
      color: "bg-emerald-500",
      lightBg: "bg-emerald-50 dark:bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      label: "Mức độ tiến bộ",
      value: data.progressionRate,
      suffix: "%",
      hint: "Sẵn sàng lên cấp",
      icon: TrendingUp,
      color: "bg-indigo-500",
      lightBg: "bg-indigo-50 dark:bg-indigo-500/10",
      textColor: "text-indigo-600 dark:text-indigo-400"
    },
    {
      label: "Tỷ lệ giữ chân",
      value: data.retention,
      suffix: "%",
      hint: "Trong 30 ngày qua",
      icon: HeartHandshake,
      color: "bg-rose-500",
      lightBg: "bg-rose-50 dark:bg-rose-500/10",
      textColor: "text-rose-600 dark:text-rose-400"
    },
  ];

  return (
    <div
      className={`grid gap-4 ${
        compact ? "md:grid-cols-2" : "grid-cols-2 lg:grid-cols-4"
      }`}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <CardContent className="space-y-3 p-4">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md ${item.lightBg}`}>
                  <Icon className={`w-4 h-4 ${item.textColor}`} />
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
              </div>
              
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {item.value}
                </p>
                <span className="text-xs font-medium text-slate-400">
                  {item.suffix}
                </span>
              </div>
              
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${item.color} shadow-sm transition-all duration-700 ease-out`}
                  style={{
                    width: `${Math.min(
                      100,
                      typeof item.value === "number" ? item.value : 100
                    )}%`,
                  }}
                />
              </div>
              
              {!compact && (
                <p className={`text-[10px] font-medium ${item.textColor}`}>
                  {item.hint}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

