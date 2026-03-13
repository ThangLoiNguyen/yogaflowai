import { Card, CardContent } from "@/components/ui/card";
import { Activity, Waves, Move, CalendarCheck } from "lucide-react";

export interface StudentProgressData {
  flexibility: number;
  balance: number;
  stress: number;
  attendance: number;
}

interface Props {
  data: StudentProgressData;
  compact?: boolean;
}

export function StudentProgress({ data, compact }: Props) {
  const items = [
    {
      label: "Độ dẻo dai",
      value: data.flexibility,
      hint: "+12 điểm so với tháng trước",
      type: "flexibility",
      icon: Waves,
      color: "bg-sky-500",
      lightBg: "bg-sky-50 dark:bg-sky-500/10",
      textColor: "text-sky-600 dark:text-sky-400"
    },
    { 
      label: "Cân bằng", 
      value: data.balance, 
      hint: "+7 điểm so với tháng trước", 
      type: "balance",
      icon: Move,
      color: "bg-indigo-500",
      lightBg: "bg-indigo-50 dark:bg-indigo-500/10",
      textColor: "text-indigo-600 dark:text-indigo-400"
    },
    { 
      label: "Căng thẳng", 
      value: data.stress, 
      hint: "-15% so với ban đầu", 
      type: "stress",
      icon: Activity,
      color: "bg-rose-500",
      lightBg: "bg-rose-50 dark:bg-rose-500/10",
      textColor: "text-rose-600 dark:text-rose-400"
    },
    { 
      label: "Chuyên cần", 
      value: data.attendance, 
      hint: "Hoàn hảo tháng này", 
      type: "attendance",
      icon: CalendarCheck,
      color: "bg-emerald-500",
      lightBg: "bg-emerald-50 dark:bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400"
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
          <Card key={item.label} className="border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
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
                <span className="text-xs text-slate-400 font-medium">/100</span>
              </div>
              
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${item.color} shadow-sm transition-all duration-700 ease-out`}
                  style={{ width: `${item.type === 'stress' ? 100 - item.value : item.value}%` }}
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

