"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.3fr)] lg:items-center">
      <div className="space-y-6">
        <Badge className="bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-400/40">
          Mới • AI cho hành trình yoga
        </Badge>
        <div className="space-y-4">
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:text-5xl">
            Tìm lớp học yoga phù hợp
            <span className="text-sky-600 dark:text-sky-400"> với cơ thể bạn</span>
          </h1>
          <p className="max-w-xl text-sm text-slate-600 dark:text-slate-300 sm:text-base">
            YogAI học từ sức khỏe, mục tiêu và tiến độ của bạn để đề xuất những lớp học phù hợp nhất—để bạn ngừng phỏng đoán và bắt đầu cảm nhận.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-3">
            <Link href="/onboarding">
              <Button className="bg-sky-500 text-white hover:bg-sky-600 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400">
                Bắt đầu ngay
              </Button>
            </Link>
            <Link href="/teacher-dashboard">
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Tôi là giáo viên
              </Button>
            </Link>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Không cần thẻ tín dụng • Khảo sát chỉ 2 phút
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-[11px] text-slate-500 dark:text-slate-400">
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-200">Dành cho cơ thể thực tế</p>
            <p>Đề xuất linh hoạt từ cơ bản đến nâng cao.</p>
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-200">Ưu tiên sức khỏe</p>
            <p>Phân tích từ chuyên môn bác sĩ vật lý trị liệu.</p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-sky-500/20 dark:bg-sky-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-6 -right-12 h-28 w-28 rounded-full bg-indigo-500/20 dark:bg-indigo-500/25 blur-3xl" />

        <div className="relative rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-4 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/60">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
            <span>Tổng quan buổi tập hôm nay</span>
            <span className="rounded-full bg-slate-100 dark:bg-slate-900 px-2 py-0.5 text-[10px] text-sky-600 dark:text-sky-300">
              Tối ưu bởi AI
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/70 p-3">
              <p className="text-[11px] font-medium text-slate-900 dark:text-slate-200">
                Tình trạng cơ thể
              </p>
              <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                <ProgressRow label="Độ dẻo dai" value={68} tone="sky" />
                <ProgressRow label="Cân bằng" value={62} tone="indigo" />
                <ProgressRow label="Căng thẳng" value={44} tone="rose" invert />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-950/70 p-3">
              <p className="text-[11px] font-medium text-slate-900 dark:text-slate-200">
                Lớp học đề xuất
              </p>
              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-50">
                  Grounded Flow • Cấp độ 1–2
                </p>
                <p>45 phút • Sức mạnh nhẹ nhàng + hông</p>
                <p className="text-[10px] text-sky-600 dark:text-sky-300">
                  Phù hợp với mức độ phục hồi & căng thẳng của bạn.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-950/80 p-3 text-[11px] text-slate-600 dark:text-slate-300">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Thông tin cho giáo viên</p>
              <p>
                Xem ai sẵn sàng nâng cao, ai cần tập nhẹ nhàng hơn.
              </p>
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-xs font-semibold text-emerald-500 dark:text-emerald-300">
                +23%
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Tỷ lệ giữ chân HV
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressRow({
  label,
  value,
  tone,
  invert,
}: {
  label: string;
  value: number;
  tone: "sky" | "indigo" | "rose";
  invert?: boolean;
}) {
  const color =
    tone === "sky"
      ? "bg-sky-400"
      : tone === "indigo"
        ? "bg-indigo-400"
        : "bg-rose-400";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span>{label}</span>
        <span className="text-slate-900 dark:text-slate-200">
          {invert ? `${100 - value}` : value}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

