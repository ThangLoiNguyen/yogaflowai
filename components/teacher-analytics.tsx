import { Card, CardContent } from "@/components/ui/card";

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
    },
    {
      label: "Tỷ lệ chuyên cần",
      value: data.avgAttendance,
      suffix: "%",
      hint: "Trung bình khóa hàng tuần",
    },
    {
      label: "Mức độ tiến bộ",
      value: data.progressionRate,
      suffix: "%",
      hint: "Sẵn sàng lên cấp",
    },
    {
      label: "Tỷ lệ giữ chân",
      value: data.retention,
      suffix: "%",
      hint: "Trong 30 ngày qua",
    },
  ];

  return (
    <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/80">
      <CardContent
        className={`grid gap-4 p-4 ${
          compact ? "md:grid-cols-2" : "md:grid-cols-4"
        }`}
      >
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {item.value}
              <span className="ml-0.5 text-xs text-slate-500 dark:text-slate-400">
                {item.suffix}
              </span>
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500 dark:bg-sky-400"
                style={{
                  width: `${Math.min(
                    100,
                    typeof item.value === "number" ? item.value : 100
                  )}%`,
                }}
              />
            </div>
            {!compact && (
              <p className="text-[10px] text-slate-600 dark:text-slate-500">{item.hint}</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

