"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Users, UserCircle, GraduationCap, ChevronRight, X, Star, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

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
      <nav className="fixed top-0 w-full z-[50] border-b border-[var(--border)] bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5 shrink-0" onClick={() => setIsOpen(false)}>
            <span className="font-display text-2xl text-[var(--text-primary)]">Yog</span>
            <span className="font-ui font-medium text-2xl text-[var(--accent)]">AI</span>
          </Link>


          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" className="h-10 px-6 rounded-full border-[var(--border-strong)] text-[var(--text-primary)] font-medium hover:bg-slate-50">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button className="btn-primary h-10 px-6 rounded-full font-medium">
                Đăng ký miễn phí
              </Button>
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-[var(--text-primary)] relative z-[60]">
            {isOpen ? <X className="w-6 h-6" /> : <div className="space-y-1.5"><div className="w-6 h-0.5 bg-current" /><div className="w-6 h-0.5 bg-current" /><div className="w-6 h-0.5 bg-current" /></div>}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-[var(--border)] py-6 px-6 flex flex-col gap-6 animate-in slide-in-from-top-5 duration-300 shadow-xl relative z-[50]">
            <Link onClick={() => setIsOpen(false)} href="/login">
              <Button variant="outline" className="w-full h-12 rounded-full border-[var(--border-strong)] text-[var(--text-primary)] font-bold">
                Đăng nhập
              </Button>
            </Link>
            <Link onClick={() => setIsOpen(false)} href="/register">
              <Button className="btn-primary w-full h-12 rounded-full text-base font-bold">
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
    <section className="relative pt-48 pb-24 bg-white overflow-hidden">
      <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-[var(--bg-sky)] rounded-full blur-[100px] blob-drift opacity-60" />
      <div className="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-[var(--accent-tint)] rounded-full blur-[100px] blob-drift opacity-40" style={{ animationDelay: '2s' }} />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <h1 className="mb-8 leading-[1.1] tracking-tight">
          YogAI <br />
          <span className="italic text-[var(--accent)] font-display">Lộ trình của riêng bạn.</span>
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed italic">
          Kết hợp sự thấu hiểu từ AI và Chuyên môn từ Giáo viên thật. Đưa việc luyện tập yoga cá nhân hóa lên một tầm cao mới.
        </p>
      </div>
    </section>
  );
};

const StatsBar = () => {
  const supabase = createClient();
  const [stats, setStats] = useState({ students: 0, teachers: 0, rating: 4.9 });

  useEffect(() => {
    async function fetchStats() {
      // 1. Students count
      const { count: studentsCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "student");

      // 2. Teachers count
      const { count: teachersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "teacher");

      // 3. Average Rating
      const { data: feedbacks } = await supabase
        .from("session_feedback")
        .select("rating")
        .gt("rating", 0);

      let avgRating = 4.9;
      if (feedbacks && feedbacks.length > 0) {
        const sum = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
        avgRating = Number((sum / feedbacks.length).toFixed(1));
      }

      setStats({
        students: studentsCount || 1200, // Fallback if 0
        teachers: teachersCount || 98,
        rating: avgRating
      });
    }

    fetchStats();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-6 border-y border-[var(--border)] py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col gap-1 items-center">
            <div className="stats-value text-4xl">
              <AnimatedCounter value={stats.students} />
            </div>
            <div className="label-mono uppercase tracking-[0.2em] text-[var(--text-muted)] text-[11px]">Học viên tích cực</div>
          </div>
          <div className="flex flex-col gap-1 items-center border-x-0 md:border-x border-[var(--border)]">
            <div className="stats-value text-4xl">
              <AnimatedCounter value={stats.teachers} />
            </div>
            <div className="label-mono uppercase tracking-[0.2em] text-[var(--text-muted)] text-[11px]">Giáo viên chuyên môn</div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <div className="stats-value text-4xl text-sky-500">
              <AnimatedCounter value={stats.rating} decimals={1} />★
            </div>
            <div className="label-mono uppercase tracking-[0.2em] text-[var(--text-muted)] text-[11px]">Điểm đánh giá trung bình</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { num: "01", title: "Đăng ký & Quiz", desc: "Trả lời 7 câu hỏi. Mất 3 phút.", tag: "Khám phá" },
    { num: "02", title: "AI gợi ý khóa", desc: "Match 100+ khóa phù hợp.", tag: "Thông minh" },
    { num: "03", title: "Live class thật", desc: "Học trực tiếp với GV.", tag: "Tương tác" },
    { num: "04", title: "Lộ trình mới", desc: "AI điều chỉnh sau buổi.", tag: "Cá nhân" },
    { num: "05", title: "Tiến bộ bền vững", desc: "Đạt mục tiêu sức khỏe.", tag: "Kết quả" },
  ];

  return (
    <section id="how" className="py-32 bg-[var(--bg-sky)]/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center">
          <div className="label-mono text-[var(--accent)] mb-4 tracking-[0.2em] font-bold">QUY TRÌNH THÔNG MINH</div>
          <h2 className="mb-6">Mỗi buổi học đều tốt hơn <span className="italic text-[var(--accent)]">với sự thấu hiểu.</span></h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-6 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--border-medium)] via-[var(--accent)] to-[var(--border-medium)] z-0 opacity-20" />

          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center relative z-10 group">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-[var(--accent)] flex items-center justify-center font-mono font-bold text-[var(--accent)] mb-6 shadow-sm transition-transform group-hover:scale-110">
                {step.num}
              </div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] text-[10px] font-mono font-bold uppercase tracking-widest mb-4">
                {step.tag}
              </div>
              <h3 className="text-lg mb-2">{step.title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed px-4 italic">{step.desc}</p>
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
        <div className="text-center mb-20">
          <h2 className="mb-4">Bắt đầu theo cách của bạn</h2>
          <p className="text-[var(--text-secondary)] text-lg italic">Hệ thống được thiết kế tối ưu cho cả người học và người dạy chuyên nghiệp.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="p-10 rounded-3xl border border-slate-100 bg-white hover:border-sky-400 hover:shadow-xl hover:shadow-sky-100/50 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-8 border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-colors">
              <UserCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl mb-4 text-slate-900 border-none font-black italic">Học viên</h3>
            <p className="text-slate-500 mb-8 leading-[1.6] italic">
              Tìm kiếm lớp học phù hợp và luyện tập dưới sự thấu hiểu của AI để đạt được mục tiêu cá nhân.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 text-sky-500 font-black text-xs uppercase tracking-widest hover:underline group-hover:gap-3 transition-all">
              Bắt đầu học ngay <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="p-10 rounded-3xl border border-slate-100 bg-white hover:border-sky-400 hover:shadow-xl hover:shadow-sky-100/50 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mb-8 border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-colors">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl mb-4 text-slate-900 border-none font-black italic">Giáo viên</h3>
            <p className="text-slate-500 mb-8 leading-[1.6] italic">
              Quản lý lớp học thông minh và thấu hiểu học viên sâu sắc hơn nhờ hệ thống dashboard AI.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 text-sky-500 font-black text-xs uppercase tracking-widest hover:underline group-hover:gap-3 transition-all">
              Trở thành giáo viên <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const FooterNote = () => (
  <footer className="py-12 bg-white border-t border-[var(--border)]">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <div className="flex items-center justify-center gap-2 text-[var(--text-muted)] text-[11px] font-mono tracking-widest uppercase mb-4">
        <ShieldCheck className="w-4 h-4 text-[var(--accent)]" />
        Hệ thống tự động chuyển hướng theo vai trò (Student/Teacher) sau khi đăng nhập.
      </div>
      <div className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-[0.2em] opacity-60">
        © 2026 YogAI — Nền tảng Yoga AI hàng đầu.
      </div>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[var(--accent)] selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <WhoAreYou />
      </main>
      <FooterNote />
    </div>
  );
}
