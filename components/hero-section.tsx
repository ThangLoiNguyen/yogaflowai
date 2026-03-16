"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Play, CheckCircle2, LayoutGrid } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
      
      {/* Background Ornaments */}
      <div className="absolute -top-24 -left-20 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-indigo-50/50 rounded-full blur-3xl -z-10" />

      <div className="space-y-8 animate-soft-fade">
        <div className="space-y-4">
          <Badge className="bg-sky-50 text-sky-700 border-sky-100/50 font-black uppercase tracking-widest text-[10px] py-1.5 px-3 rounded-full">
            <Sparkles className="w-3 h-3 mr-2" /> Trí tuệ nhân tạo cho Yoga
          </Badge>
          
          <h1 className="text-balance text-5xl font-black tracking-tighter text-slate-900 sm:text-6xl md:text-7xl leading-[0.95]">
            Tìm lớp học Yoga <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">phù hợp nhất</span>
          </h1>
          
          <p className="max-w-xl text-lg text-slate-400 font-medium leading-relaxed">
            YogAI phân tích sức khỏe, mục tiêu và tiến độ của bạn để đề xuất những lớp học tối ưu—để bạn ngừng phỏng đoán và bắt đầu cảm nhận sự thay đổi.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-4">
            <Link href="/signup">
              <Button className="h-16 px-10 bg-slate-900 text-white hover:bg-slate-800 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-slate-200 transition-all active:scale-95">
                Bắt đầu ngay <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button
                variant="outline"
                className="h-16 px-10 border-slate-100 bg-white text-slate-600 hover:bg-slate-50 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all"
              >
                Khám phá AI
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-8 items-center pt-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                 <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dành cho bạn</p>
                 <p className="text-xs font-bold text-slate-700">Đề xuất cá nhân hóa</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                 <LayoutGrid className="w-5 h-5 text-indigo-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đa dạng</p>
                 <p className="text-xs font-bold text-slate-700">Hàng trăm lớp học</p>
              </div>
           </div>
        </div>
      </div>

      {/* Visual Component / Hero Illustration */}
      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-tr from-sky-100 to-indigo-100 rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
        
        <div className="relative rounded-[3rem] border border-white bg-white/80 backdrop-blur-xl p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500/0 via-sky-500/10 to-sky-500/0" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Phân tích buổi tập</p>
               <h4 className="text-lg font-black text-slate-900 leading-none">Chỉ số học viên</h4>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center">
               <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-6 p-6 rounded-[2rem] bg-slate-50/50 border border-slate-50">
               <ProgressRow label="Độ dẻo dai" value={68} tone="sky" />
               <ProgressRow label="Cân bằng" value={62} tone="indigo" />
               <ProgressRow label="Stress" value={44} tone="rose" />
            </div>

            <div className="flex flex-col gap-4">
               <div className="p-6 rounded-[2rem] bg-indigo-600 text-white shadow-xl shadow-indigo-100">
                  <Badge className="bg-white/20 text-white border-none text-[9px] font-black uppercase px-2 mb-3">Today's Class ⟡</Badge>
                  <p className="text-base font-black leading-tight mb-1">Grounded Flow</p>
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Cấp độ 1–2 • 45m</p>
               </div>
               
               <div className="p-6 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiến độ</p>
                    <p className="text-lg font-black text-slate-900">+12%</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                     <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
               </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between p-4 rounded-2xl bg-slate-900 text-white">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                   <Sparkles className="w-4 h-4 text-sky-400" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">YogAI Insights</p>
             </div>
             <p className="text-[10px] font-medium text-slate-400 italic">"Cơ thể bạn đang phục hồi tốt..."</p>
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
