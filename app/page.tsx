"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  UserCircle,
  GraduationCap,
  X,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  Database,
  Search
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
      <nav className="fixed top-0 w-full z-[50] border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-22 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1 shrink-0 group transition-all hover:scale-105" onClick={() => setIsOpen(false)}>
            <span className="font-display text-2xl lg:text-3xl text-slate-900 font-bold group-hover:text-black transition-colors">Yog</span>
            <span className="font-ui font-medium text-2xl lg:text-3xl text-sky-500">AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <Link href="/login">
              <Button variant="ghost" className="h-11 px-6 rounded-xl text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button className="h-11 px-9 rounded-xl bg-sky-500 text-white font-black text-xs uppercase tracking-widest hover:bg-sky-600 shadow-xl shadow-sky-100 transition-all active:scale-95">
                Bắt đầu ngay
              </Button>
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-3 text-slate-900 relative z-[60] bg-slate-50 rounded-xl">
            {isOpen ? <X className="w-6 h-6" /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-current rounded-full" /><div className="w-6 h-0.5 bg-current rounded-full w-2/3" /></div>}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-10 px-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-500 shadow-2xl relative z-[50]">
            <Link onClick={() => setIsOpen(false)} href="/login">
              <Button variant="outline" className="w-full h-14 rounded-xl border-slate-200 text-slate-900 font-bold text-sm">
                Đăng nhập
              </Button>
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/register">
              <Button className="w-full h-14 rounded-xl bg-sky-500 text-white text-base font-bold shadow-lg shadow-sky-100">
                Đăng ký ngay
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </>
  );
};

const Hero = () => {
  const [mounted, setMounted] = useState(false);
  const words = [
    { text: "Mỗi", style: "normal" },
    { text: "buổi", style: "normal" },
    { text: "học", style: "normal" },
    { text: "được", style: "normal" },
    { text: "điều", style: "highlight" },
    { text: "chỉnh", style: "highlight" },
    { text: "theo", style: "normal" },
    { text: "thể", style: "accent" },
    { text: "trạng", style: "accent" },
    { text: "và", style: "normal" },
    { text: "tiến", style: "accent" },
    { text: "trình", style: "accent" },
    { text: "của", style: "normal" },
    { text: "bạn", style: "normal" }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative pt-44 pb-32 bg-white overflow-hidden min-h-[75vh] flex items-center justify-center">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeInRise {
          from { opacity: 0; transform: translateY(2rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drift {
          from { transform: translate(0,0); }
          50% { transform: translate(2%, 2%); }
          to { transform: translate(0,0); }
        }
        @keyframes scan {
          from { top: -120px; }
          to { top: 100%; }
        }
        .hero-animation-base {
          animation-duration: 1s;
          animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: forwards;
        }
        .hero-animation-drift {
          animation-duration: 10s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .hero-animation-scan {
          animation-duration: 4s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .hero-active {
          animation-name: fadeInRise;
        }
        .drift-active {
          animation-name: drift;
        }
        .scan-active {
          animation-name: scan;
        }
      `}} />

      {/* ATMOSPHERIC BACKGROUND (LIGHT) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-50 rounded-full blur-[140px] hero-animation-drift ${mounted ? 'drift-active' : ''}`}
        />
        <div
          className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-100 rounded-full blur-[120px] hero-animation-drift ${mounted ? 'drift-active' : ''}`}
          style={{ animationDelay: '2s' }}
        />
        <div
          className={`absolute inset-x-0 pointer-events-none bg-gradient-to-b from-transparent via-sky-500/5 to-transparent h-[120px] opacity-20 hero-animation-scan ${mounted ? 'scan-active' : ''}`}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <h1 className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-3 text-4xl lg:text-[6rem] leading-[0.98] tracking-tighter text-slate-900 font-bold border-none shadow-none mb-16 px-4">
          {words.map((word, i) => (
            <span
              key={`${mounted}-${i}`}
              className={`inline-block opacity-0 hero-animation-base ${mounted ? 'hero-active' : ''} ${word.style === 'highlight' ? 'text-slate-400' :
                  word.style === 'accent' ? 'text-sky-500 bg-clip-text' :
                    'text-slate-900'
                }`}
              style={{
                animationDelay: `${i * 0.08}s`,
                textShadow: word.style === 'accent' ? '0 10px 40px rgba(14,165,233,0.1)' : 'none'
              }}
            >
              {word.text}
            </span>
          ))}
        </h1>

        <div
          className={`opacity-0 hero-animation-base ${mounted ? 'hero-active' : ''}`}
          style={{ animationDelay: '1.8s' }}
        >
          <Link href="/register">
            <Button className="h-16 px-12 rounded-[1.5rem] bg-slate-900 text-white font-bold text-[13px] uppercase tracking-[0.2em] hover:bg-sky-500 transition-all active:scale-95 shadow-2xl shadow-slate-200 group">
              Khám phá lộ trình <ArrowRight className="w-5 h-5 ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 text-slate-300 hero-animation-base ${mounted ? 'hero-active' : ''}`}
        style={{ animationDelay: '2.5s' }}
      >
        <div className="h-px w-20 bg-slate-100" />
        <span className="text-[9px] font-bold uppercase tracking-[0.5em] whitespace-nowrap">Intelligence Coaching</span>
        <div className="h-px w-20 bg-slate-100" />
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
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-slate-900">
          <div className="flex flex-col gap-3 group cursor-default">
            <div className="text-4xl lg:text-6xl font-bold group-hover:scale-105 transition-transform duration-500">
              <AnimatedCounter value={stats.students} />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300 group-hover:text-sky-500 transition-colors">Học viên</div>
          </div>
          <div className="flex flex-col gap-3 md:border-x border-slate-100 group cursor-default">
            <div className="text-4xl lg:text-6xl font-bold group-hover:scale-105 transition-transform duration-500 text-sky-500">
              <AnimatedCounter value={stats.teachers} />
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300 group-hover:text-sky-500 transition-colors">Giảng viên</div>
          </div>
          <div className="flex flex-col gap-3 group cursor-default">
            <div className="text-4xl lg:text-6xl font-bold group-hover:scale-105 transition-transform duration-500">
              <AnimatedCounter value={stats.rating} decimals={1} /> ★
            </div>
            <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300 group-hover:text-sky-500 transition-colors">Đánh giá</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: "01", title: "Khám phá bản thân", desc: "Trả lời câu hỏi nhanh để AI phân tích toàn diện thể trạng và mong muốn của bạn." },
    { num: "02", title: "AI Phân tích sâu", desc: "Hệ thống tự động đề xuất lộ trình phù hợp 95% mục tiêu cá nhân của riêng bạn." },
    { num: "03", title: "Trải nghiệm Yoga Live", desc: "Tham gia các buổi Live cùng đội ngũ giáo viên chuyên nghiệp hàng đầu thế giới." },
    { num: "04", title: "Tối ưu liên tục", desc: "AI lắng nghe cảm nhận và tự động tinh chỉnh giáo án để bạn tiến bộ nhanh nhất." },
  ];

  return (
    <section id="how" className="py-20 bg-slate-50/40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24 space-y-6 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-sky-500">Sự tận tâm của AI</span>
          <h2 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">Mọi buổi tập đều <br />được thiết kế cho bạn.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="bg-white p-10 rounded-[3rem] border border-slate-100 hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-100 hover:-translate-y-2 transition-all duration-700 group cursor-pointer relative overflow-hidden">
              <div className="text-5xl font-black text-slate-80 mb-8 group-hover:text-sky-300 transition-colors duration-700">
                {step.num}
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">{step.title}</h3>
              <p className="text-slate-400 text-base leading-relaxed">{step.desc}</p>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-sky-50 rounded-full blur-2xl group-hover:bg-sky-100 transition-all duration-1000" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhoAreYou = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-12 lg:p-16 rounded-[3rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-100 transition-all duration-700 flex flex-col justify-between group cursor-pointer relative overflow-hidden min-h-[500px]">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 flex items-center justify-center mb-10 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <UserCircle className="w-8 h-8" />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-8 border-none leading-tight">Dành cho <br /><span className="text-sky-500">Học viên</span></h3>
              <p className="text-slate-500 text-lg leading-relaxed max-w-sm">Tập luyện khoa học hơn với lộ trình cá nhân hóa từ trợ lý AI.</p>
            </div>
            <Link href="/register" className="relative z-10 inline-flex items-center gap-4 text-slate-900 font-bold text-[13px] uppercase tracking-[0.3em] hover:text-sky-600 transition-colors group-hover:gap-6">
              Bắt đầu ngay <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />
          </div>

          <div className="p-12 lg:p-16 rounded-[3rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-sky-300 hover:shadow-2xl hover:shadow-sky-100 transition-all duration-700 flex flex-col justify-between group cursor-pointer relative overflow-hidden min-h-[500px]">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-white border border-slate-100 flex items-center justify-center mb-10 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-5xl font-bold text-slate-900 mb-8 border-none leading-tight">Dành cho <br /><span className="text-sky-500">Giáo viên</span></h3>
              <p className="text-slate-500 text-lg leading-relaxed max-w-sm">Quản lý lớp học thông minh and đồng hành cùng sự tiến bộ của AI.</p>
            </div>
            <Link href="/register" className="relative z-10 inline-flex items-center gap-4 text-slate-900 font-bold text-[13px] uppercase tracking-[0.3em] hover:text-sky-600 transition-colors group-hover:gap-6">
              Gia nhập đội ngũ <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-sky-50 selection:text-sky-900 text-slate-900 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <WhoAreYou />
        <footer className="py-24 text-center border-t border-slate-100 bg-white">
          <div className="flex items-center justify-center gap-4 text-slate-300 text-[10px] font-bold uppercase tracking-[1em] mb-8 leading-none">
            <ShieldCheck className="w-4 h-4" /> Secure Health OS
          </div>
          <p className="text-[11px] text-slate-200 uppercase tracking-[0.4em] font-mono whitespace-nowrap">
            © 2026 YogAI — Mastering Human Movement.
          </p>
        </footer>
      </main>
    </div>
  );
}
