"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowRight, 
  Users, 
  UserCircle, 
  GraduationCap, 
  ChevronRight, 
  X, 
  Star, 
  Globe, 
  ShieldCheck, 
  CheckCircle,
  Sparkles,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

function AnimatedCounter({ value, duration = 1500, decimals = 0 }: { value: number, duration?: number, decimals?: number }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted) {
        setHasStarted(true);
      }
    }, { threshold: 0.1 });

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(progress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, value, duration]);

  return (
    <span ref={elementRef}>
      {count.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/5 backdrop-blur-[1px] z-[45] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <nav className="fixed top-0 w-full z-[50] border-b border-slate-100 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5 shrink-0" onClick={() => setIsOpen(false)}>
            <span className="font-display text-2xl text-slate-900">Yog</span>
            <span className="font-ui font-medium text-2xl text-sky-500">AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="h-10 px-6 rounded-full text-slate-600 font-bold text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all font-mono">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button className="h-10 px-8 rounded-full bg-sky-500 text-white font-black text-[11px] uppercase tracking-widest hover:bg-sky-600 shadow-xl shadow-sky-100 transition-all font-mono">
                Bắt đầu ngay
              </Button>
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-900 relative z-[60]">
            {isOpen ? <X className="w-6 h-6" /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-current" /><div className="w-6 h-0.5 bg-current" /><div className="w-6 h-0.5 bg-current" /></div>}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-6 px-6 flex flex-col gap-6 animate-in slide-in-from-top-5 duration-300 shadow-xl relative z-[50]">
            <Link onClick={() => setIsOpen(false)} href="/login">
              <Button variant="outline" className="w-full h-12 rounded-full border-slate-200 text-slate-900 font-bold">
                Đăng nhập
              </Button>
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/register">
              <Button className="w-full h-12 rounded-full bg-sky-500 text-white text-base font-bold shadow-lg shadow-sky-100">
                Đăng ký miễn phí
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-48 pb-32 bg-white overflow-hidden hero-section">
      <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-sky-50 rounded-full blur-[120px] blob-drift opacity-40" />
      <div className="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-slate-100 rounded-full blur-[100px] blob-drift opacity-30" style={{ animationDelay: '2s' }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-[0.3em] font-mono mb-8 text-slate-300">
           <Sparkles className="w-3 h-3" /> AI-Powered Wellness
        </div>
        <h1 className="text-4xl lg:text-6xl mb-10 leading-[1.1] tracking-tight text-slate-900 font-black italic border-none shadow-none">
          Yoga thế hệ mới <br />
          <span className="text-sky-500 underline decoration-sky-100 decoration-8 underline-offset-4">Thấu hiểu từng hơi thở.</span>
        </h1>
        <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed italic mb-12">
          Kết hợp sự thấu hiểu từ AI và chuyên môn từ giáo viên thật. Lộ trình của bạn sẽ tự động điều chỉnh sau mỗi buổi tập.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
           <Link href="/register">
              <Button className="h-14 px-10 rounded-2xl bg-sky-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-sky-500/20 hover:bg-sky-600 transition-all active:scale-95">Trải nghiệm miễn phí</Button>
           </Link>
           <Button variant="ghost" className="h-14 px-8 rounded-2xl text-slate-400 font-bold text-xs uppercase tracking-widest gap-3 hover:text-slate-900 transition-all">
              <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-sky-50 transition-all"><Play className="w-3 h-3 fill-current" /></div>
              Xem video giới thiệu
           </Button>
        </div>
      </div>
    </section>
  );
};

const StatsBar = () => {
  const supabase = createClient();
  const [stats, setStats] = useState({ students: 0, teachers: 0, rating: 4.9 });

  useEffect(() => {
    async function fetchStats() {
      const { count: s } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "student");
      const { count: t } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("role", "teacher");
      setStats({ students: s || 1200, teachers: t || 98, rating: 4.9 });
    }
    fetchStats();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 border-y border-slate-50 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="flex flex-col gap-2 items-center">
            <div className="text-4xl lg:text-5xl font-black italic text-slate-900">
               <AnimatedCounter value={stats.students} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] font-mono text-slate-300">Học viên tích cực</div>
          </div>
          <div className="flex flex-col gap-2 items-center border-x-0 md:border-x border-slate-50">
            <div className="text-4xl lg:text-5xl font-black italic text-slate-900">
               <AnimatedCounter value={stats.teachers} />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] font-mono text-slate-300">Giáo viên chuyên môn</div>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <div className="text-4xl lg:text-5xl font-black italic text-sky-500">
               <AnimatedCounter value={stats.rating} decimals={1} />★
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] font-mono text-slate-300">Đánh giá trung bình</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: "01", title: "Khám phá", desc: "Trả lời 7 câu hỏi nhanh để AI lượng giá thể trạng." },
    { num: "02", title: "Phân tích", desc: "Hệ thống đề xuất khóa học phù hợp 95% mục tiêu." },
    { num: "03", title: "Trải nghiệm", desc: "Tham gia các buổi Live cùng giáo viên chuyên nghiệp." },
    { num: "04", title: "Phản hồi", desc: "AI lắng nghe cảm nhận và tinh chỉnh độ khó buổi sau." },
  ];

  return (
    <section id="how" className="py-32 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 text-center space-y-4">
           <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 font-mono">Quy trình thông minh</span>
           <h2 className="text-3xl lg:text-5xl font-black italic text-slate-900 border-none shadow-none">Thấu hiểu từng bước chân.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center lg:items-start text-center lg:text-left group">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center font-mono font-black text-xl text-slate-200 mb-8 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                {step.num}
              </div>
              <h3 className="text-xl font-bold mb-3 italic text-slate-900">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed italic opacity-80">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhoAreYou = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="p-10 lg:p-14 rounded-[3rem] border border-slate-100 bg-white hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-100 transition-all group overflow-hidden relative">
            <div className="relative z-10">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-10 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                 <UserCircle className="w-6 h-6" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 mb-4 italic leading-tight border-none">Dành cho <br/><span className="text-sky-500">Học viên</span></h3>
               <p className="text-slate-500 mb-10 leading-relaxed italic opacity-80 max-w-sm">
                 Tập luyện khoa học hơn với sự thấu hiểu của AI. Lộ trình cá nhân hóa tuyệt đối cho riêng bạn.
               </p>
               <Link href="/register" className="inline-flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:text-sky-500 transition-all font-mono group-hover:gap-5">
                 Bắt đầu ngay <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-sky-500/5 rounded-full blur-[100px]" />
          </div>

          <div className="p-10 lg:p-14 rounded-[3rem] border border-slate-100 bg-white hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-100 transition-all group overflow-hidden relative">
            <div className="relative z-10">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-10 border border-slate-100 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                 <GraduationCap className="w-6 h-6" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 mb-4 italic leading-tight border-none">Dành cho <br/><span className="text-sky-500">Giáo viên</span></h3>
               <p className="text-slate-500 mb-10 leading-relaxed italic opacity-80 max-w-sm">
                 Quản lý lớp học thông minh và thấu hiểu học viên sâu sắc hơn nhờ hệ thống dashboard AI.
               </p>
               <Link href="/register" className="inline-flex items-center gap-3 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:text-sky-500 transition-all font-mono group-hover:gap-5">
                 Gia nhập đội ngũ <ArrowRight className="w-4 h-4" />
               </Link>
            </div>
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-sky-500/5 rounded-full blur-[100px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-sky-100 selection:text-sky-900">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <WhoAreYou />
        <footer className="py-20 text-center border-t border-slate-50 bg-white">
           <div className="flex items-center justify-center gap-2 text-slate-300 text-[9px] font-black tracking-[0.3em] uppercase mb-6 font-mono">
              <ShieldCheck className="w-4 h-4" /> Secure & Intelligent System
           </div>
           <div className="text-[10px] text-slate-200 font-mono uppercase tracking-widest">
              © 2026 YogAI — Elevate your practice.
           </div>
        </footer>
      </main>
    </div>
  );
}
