import { Card, CardContent } from "@/components/ui/card";

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
      type: "flexibility"
    },
    { label: "Cân bằng", value: data.balance, hint: "+7 điểm so với tháng trước", type: "balance" },
    { label: "Mức căng thẳng", value: 100 - data.stress, hint: "Càng thấp càng tốt", type: "stress" },
    { label: "Chuyên cần", value: data.attendance, hint: "Tháng hiện tại", type: "attendance" },
  ];

  return (
    <div
      className={`grid gap-4 ${
        compact ? "md:grid-cols-2" : "md:grid-cols-4"
      }`}
    >
      {items.map((item) => (
        <Card key={item.label} className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950/80">
          <CardContent className="space-y-2 p-3">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              {item.value}
              <span className="ml-1 text-xs text-slate-400 dark:text-slate-500">
                {item.type === "stress" ? "/100 (thấp là tốt)" : "/100"}
              </span>
            </p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500 dark:bg-sky-400"
                style={{ width: `${item.value}%` }}
              />
            </div>
            {!compact && (
              <p className="text-[10px] text-slate-500 dark:text-slate-500">{item.hint}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

