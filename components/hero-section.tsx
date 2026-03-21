"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Play, CheckCircle2, LayoutGrid } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">

      {/* Background Ornaments */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-sky-100/30 rounded-full blur-[120px] -z-10 animate-float" style={{ animationDuration: '8s' }} />
      <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] bg-indigo-50/40 rounded-full blur-[100px] -z-10 animate-float" style={{ animationDuration: '10s', animationDelay: '1s' }} />

      <div className="space-y-10 animate-soft-fade">
        <div className="space-y-6">
          <Badge className="bg-sky-50 text-sky-700 border-sky-100/50 font-black uppercase tracking-[0.2em] text-[9px] py-1.5 px-4 rounded-full shadow-sm hover:shadow-sky-100 transition-all cursor-default">
            <Sparkles className="w-3 h-3 mr-2 animate-pulse" /> Trí tuệ nhân tạo cho Yoga
          </Badge>

          <h1 className="text-balance text-6xl font-black tracking-tighter text-slate-900 md:text-8xl leading-[0.9] lg:max-w-[1.1fr]">
            Yoga <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-indigo-800">Thế hệ mới</span>
          </h1>

          <p className="max-w-xl text-lg text-slate-400 font-medium leading-relaxed">
            YogAI phân tích sức khỏe, mục tiêu và tiến độ của bạn để kiến tạo lộ trình luyện tập độc bản—kết nối chiều sâu tâm hồn với sức mạnh công nghệ.
          </p>
        </div>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Link href="/signup">
            <Button className="h-16 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] group">
              Bắt đầu ngay <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button
              variant="outline"
              className="h-16 px-6 border-slate-100 bg-white text-slate-900 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:border-slate-200"
            >
              Khám phá AI
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-10 items-center pt-8 border-t border-slate-50">
          <div className="flex items-center gap-4 group/item">
            <div className="w-9 h-9 rounded-[1.2rem] bg-emerald-50 flex items-center justify-center group-hover/item:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Cá nhân hóa</p>
              <p className="text-sm font-black text-slate-900">Dành riêng cho bạn</p>
            </div>
          </div>
          <div className="flex items-center gap-4 group/item">
            <div className="w-9 h-9 rounded-[1.2rem] bg-indigo-50 flex items-center justify-center group-hover/item:scale-110 transition-transform">
              <LayoutGrid className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Hệ sinh thái</p>
              <p className="text-sm font-black text-slate-900">Tối ưu vận hành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Component / Hero Illustration */}
      <div className="relative group perspective-1000">
        <div className="absolute -inset-10 bg-gradient-to-tr from-sky-200 via-indigo-200 to-sky-200 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

        <div className="relative rounded-[3.5rem] border-4 border-white bg-white/60 backdrop-blur-3xl p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-700 hover:shadow-[0_80px_120px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-2">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/20 to-sky-500/0" />

          <div className="flex items-center justify-between mb-10">
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Deep Analytics</p>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Hành trình 2026</h4>
            </div>
            <div className="h-9 w-9 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-100 group-hover:rotate-12 transition-transform duration-500">
              <Play className="w-5 h-5 text-white fill-white" />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-8 p-5 rounded-[2.5rem] bg-white shadow-xl shadow-slate-100/50 border border-slate-50">
              <ProgressRow label="Độ dẻo dai" value={68} tone="sky" />
              <ProgressRow label="Cân bằng" value={62} tone="indigo" />
              <ProgressRow label="Stress" value={44} tone="rose" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-5 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-indigo-200/20 relative overflow-hidden group/card">
                <Sparkles className="absolute -right-4 -top-4 w-24 h-24 opacity-10 group-hover/card:scale-125 transition-transform duration-1000" />
                <Badge className="bg-white/10 text-sky-400 border-none text-[9px] font-black uppercase tracking-widest px-2.5 py-1 mb-4">Today's Goal ⟡</Badge>
                <p className="text-xl font-black leading-tight mb-2">Grounded Flow</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Cấp độ 1–2 • 45m</p>
              </div>

              <div className="p-5 rounded-[2.5rem] bg-white border border-slate-50 flex items-center justify-between shadow-sm group-hover:shadow-lg transition-shadow">
                <div>
                  <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mb-1">Tiến độ</p>
                  <p className="text-xl font-black text-slate-900 tracking-tighter">+12%</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between p-4 rounded-3xl bg-indigo-50/50 border border-indigo-100/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-700">YogAI Insights</p>
            </div>
            <p className="text-[11px] font-bold text-slate-400 italic">"Cơ thể bạn đang phục hồi tốt nhất vào tối nay..."</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProgressRow({ label, value, tone }: { label: string; value: number; tone: "sky" | "indigo" | "rose" }) {
  const color = tone === "sky" ? "bg-sky-400" : tone === "indigo" ? "bg-indigo-400" : "bg-rose-400";
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
