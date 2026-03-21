"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Star, Users, CheckCircle, Smartphone, Play, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[var(--border)] bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-0.5">
          <span className="font-display text-3xl text-[var(--text-primary)]">Yog</span>
          <span className="font-ui font-medium text-3xl text-[var(--accent)]">AI</span>
        </Link>
        <div className="hidden md:flex items-center gap-10">
          <Link href="#teachers" className="text-sm font-ui text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Giáo viên</Link>
          <Link href="#how" className="text-sm font-ui text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Cách hoạt động</Link>
          <Link href="#pricing" className="text-sm font-ui text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Bảng giá</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-ui text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">Đăng nhập</Link>
          <Link href="/register">
            <Button className="btn-primary">
              Bắt đầu miễn phí
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative pt-40 pb-32 overflow-hidden hero-section bg-[var(--bg-sky)]">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl blob-drift" />
      <div className="absolute bottom-[10%] left-[-5%] w-72 h-72 bg-blue-200/20 rounded-full blur-3xl blob-drift" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="visible">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--border-medium)] mb-8">
            <div className="w-2 h-2 rounded-full bg-[var(--accent)] translate-y-[1px]" />
            <span className="font-mono text-[10px] tracking-widest text-[var(--text-muted)] uppercase">AI-powered yoga platform</span>
          </div>
          
          <h1 className="mb-8 leading-[1.05]">
            Yoga live.<br />
            Lộ trình của<br />
            <span className="italic text-[var(--accent)]">riêng bạn.</span>
          </h1>
          
          <p className="text-lg text-[var(--text-secondary)] mb-10 max-w-lg leading-relaxed">
            Kết hợp sự thấu hiểu từ AI và Chuyên môn từ Giáo viên thật. Đưa việc luyện tập yoga cá nhân hóa lên một tầm cao mới.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link href="/register">
              <Button className="btn-primary px-10 h-14 text-base group">
                Bắt đầu miễn phí
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/teachers">
              <Button variant="ghost" className="h-14 px-10 text-base text-[var(--text-primary)] hover:bg-white/50 border border-transparent hover:border-[var(--border)] rounded-[var(--r-pill)]">
                Xem giáo viên
              </Button>
            </Link>
          </div>
          
          <p className="text-xs font-mono text-[var(--text-muted)] tracking-wider">
            KHÔNG CẦN THẺ TÍN DỤNG · HỦY BẤT KỲ LÚC NÀO
          </p>

          <div className="grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-[var(--border)]">
            <div>
              <div className="stats-value">1.200+</div>
              <div className="label-mono mt-1">Học viên</div>
            </div>
            <div>
              <div className="stats-value">98</div>
              <div className="label-mono mt-1">Giáo viên</div>
            </div>
            <div>
              <div className="stats-value">4.9★</div>
              <div className="label-mono mt-1">Rating</div>
            </div>
          </div>
        </div>

        <div className="relative group lg:block hidden visible" data-reveal>
          <div className="aspect-[4/3] rounded-[var(--r-lg)] bg-white/40 backdrop-blur-xl border border-white/40 shadow-sky overflow-hidden card-float p-8">
             {/* Mock UI for AI Insights */}
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                     <Users className="w-5 h-5 text-[var(--accent)]" />
                   </div>
                   <div>
                     <div className="font-ui font-medium text-sm text-[var(--text-primary)]">Học viên: Minh Anh</div>
                     <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Session: Vinyasa Flow #4</div>
                   </div>
                 </div>
                 <div className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-mono">STABLE PROGRESS</div>
               </div>
               
               <div className="space-y-4">
                 <div className="p-4 rounded-[var(--r-md)] bg-white border border-[var(--border)] shadow-sm">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                     <div className="text-[10px] font-mono text-[var(--accent)] uppercase font-bold">AI Suggestion</div>
                   </div>
                   <div className="text-sm font-ui text-[var(--text-primary)] leading-[1.6]">
                     Tăng độ mở khớp hông trong 3 buổi tiếp theo. 
                     <span className="block mt-2 text-[12px] text-[var(--text-secondary)]">Dựa trên data fatigue level 4/10 và mood 5/5.</span>
                   </div>
                 </div>
                 
                 <div className="flex gap-3">
                   <div className="flex-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[var(--accent)] bar-fill" style={{ width: '75%' }} />
                   </div>
                   <div className="flex-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[var(--accent)] bar-fill" style={{ width: '45%' }} />
                   </div>
                   <div className="flex-1 h-1 bg-blue-100 rounded-full overflow-hidden">
                     <div className="h-full bg-[var(--accent)] bar-fill" style={{ width: '90%' }} />
                   </div>
                 </div>
               </div>
             </div>
          </div>
          
          <div className="absolute -bottom-6 -left-6 p-4 bg-white rounded-2xl shadow-lg border border-[var(--border)] max-w-[200px] card-float" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-3 mb-2">
               <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                 <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
               </div>
               <div className="text-[10px] font-mono font-bold uppercase">Reward</div>
            </div>
            <p className="text-xs font-ui">Streak 12 ngày! Bạn nhận thêm 1 badge "Early Bird".</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { title: "Đăng ký & Quiz", desc: "Trả lời 7 câu hỏi. Mất 3 phút.", num: "01" },
    { title: "AI gợi ý khóa", desc: "AI match hồ sơ với 100+ khóa học.", num: "02" },
    { title: "Live class", desc: "Học với giáo viên thật. Điền quiz sau buổi.", num: "03" },
    { title: "Lộ trình cập nhật", desc: "AI phân tích, GV điều chỉnh sau mỗi buổi.", num: "04" },
  ];

  return (
    <section id="how" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-24">
          <div className="label-mono text-[var(--accent)] mb-4">Quy trình thông minh</div>
          <h2 className="mb-6">Mỗi buổi học đều tốt hơn <span className="italic text-[var(--accent)]">với sự thấu hiểu.</span></h2>
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-[40px] left-0 w-full h-[1px] bg-[var(--border-medium)] z-0" />
          
          {steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-[var(--r-lg)] bg-white border border-[var(--border-strong)] flex items-center justify-center mb-10 shadow-sm relative group hover:border-[var(--accent)] transition-colors">
                <span className="font-mono text-[14px] font-bold text-[var(--accent)]">{step.num}</span>
                {/* Connector dot */}
                <div className="hidden md:block absolute right-[-40px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--accent)] opacity-20 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="mb-4">{step.title}</h3>
              <p className="text-[var(--text-secondary)]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section className="py-32 bg-[var(--bg-base)]">
       <div className="max-w-7xl mx-auto px-6">
         <div className="grid md:grid-cols-3 gap-10">
           <div className="p-10 rounded-[var(--r-xl)] bg-white border border-[var(--border)] shadow-md hover:shadow-lg transition-shadow">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-10">
               <Globe className="text-[var(--accent)] w-6 h-6" />
             </div>
             <h3 className="mb-6 text-xl">Live class thật</h3>
             <p className="text-[var(--text-secondary)] leading-relaxed">
               Không còn video ghi sẵn. Bạn tương tác trực tiếp với giáo viên qua nền tảng LiveKit chất lượng cao.
             </p>
           </div>
           
           <div className="p-10 rounded-[var(--r-xl)] bg-white border border-[var(--accent)]/30 shadow-sky scale-105 z-10">
             <div className="inline-flex items-center h-8 px-4 rounded-full bg-[var(--accent-tint)] text-[var(--accent)] text-[10px] font-mono font-bold tracking-widest uppercase mb-10">Featured</div>
             <h3 className="mb-6 text-xl">AI Feedback Loop</h3>
             <p className="text-[var(--text-secondary)] leading-relaxed">
               Vòng lặp hoàn hảo: Quiz → AI → Teacher → Lộ trình. Đảm bảo mọi bài tập đều phù hợp với thể trạng của bạn ngày hôm đó.
             </p>
           </div>

           <div className="p-10 rounded-[var(--r-xl)] bg-white border border-[var(--border)] shadow-md hover:shadow-lg transition-shadow">
             <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-10">
               <Users className="text-[var(--accent)] w-6 h-6" />
             </div>
             <h3 className="mb-6 text-xl">Giáo viên thấu hiểu</h3>
             <p className="text-[var(--text-secondary)] leading-relaxed">
               Giáo viên nắm rõ lịch sử luyện tập, điểm đau và mức độ mệt mỏi của bạn thông qua dashboard AI dashboard.
             </p>
           </div>
         </div>
       </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="mb-6">Bảng giá minh bạch</h2>
          <p className="text-[var(--text-secondary)]">Không cần thẻ tín dụng để bắt đầu. Hoàn tiền trong 7 ngày nếu không hài lòng.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 items-end">
           {/* Tier 1 */}
           <div className="p-10 rounded-[var(--r-xl)] border border-[var(--border)] bg-white flex flex-col">
              <div className="label-mono uppercase mb-4">Cơ bản</div>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-4xl font-display font-medium">Free</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)]" /> 
                  Trả theo từng buổi lẻ
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)]" /> 
                  Onboarding AI quiz
                </li>
              </ul>
              <Button variant="outline" className="w-full h-14 rounded-full border-[var(--border-medium)] text-[var(--text-primary)] font-medium">Bắt đầu ngay</Button>
           </div>

           {/* Tier 2 */}
           <div className="p-12 rounded-[var(--r-xl)] border-2 border-[var(--accent)] bg-white shadow-sky relative flex flex-col">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white font-mono text-[10px] tracking-widest font-bold px-4 py-1.5 rounded-full uppercase">Popular</div>
              <div className="label-mono uppercase mb-4 text-[var(--accent)]">Pro Member</div>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-4xl font-display font-medium">890k</span>
                <span className="text-sm font-ui text-[var(--text-muted)]">/tháng</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)] font-medium">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)]" /> 
                  8 buổi live/tháng
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)] font-medium">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)]" /> 
                  Full AI Feedback Loop
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-primary)] font-medium">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)]" /> 
                  Ưu tiên booking lớp hot
                </li>
              </ul>
              <Button className="btn-primary w-full h-14 text-base font-medium">Gói Pro ngay</Button>
           </div>

           {/* Tier 3 */}
           <div className="p-10 rounded-[var(--r-xl)] border border-[var(--border)] bg-white flex flex-col">
              <div className="label-mono uppercase mb-4">Premium</div>
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-4xl font-display font-medium">1.69M</span>
                <span className="text-sm font-ui text-[var(--text-muted)]">/tháng</span>
              </div>
              <ul className="space-y-4 mb-12 flex-1">
                <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)]" /> 
                  Không giới hạn buổi học
                </li>
                <li className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)]" /> 
                  1-1 Coaching với Giáo viên/tháng
                </li>
              </ul>
              <Button variant="outline" className="w-full h-14 rounded-full border-[var(--border-medium)] text-[var(--text-primary)] font-medium">Liên hệ chúng tôi</Button>
           </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 bg-[var(--accent)] text-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-white mb-8 italic leading-tight max-w-4xl mx-auto">
          "Cơ thể bạn xứng đáng với một lộ trình của riêng mình."
        </h2>
        <Link href="/register">
          <Button variant="outline" className="h-16 px-12 bg-white text-[var(--text-primary)] border-none rounded-full font-medium text-lg hover:bg-[var(--bg-sky)] shadow-lg active:scale-95 transition-all">
            Đăng ký tham gia ngay
          </Button>
        </Link>
      </div>
      {/* Visual flourishes */}
      <div className="absolute top-[-50%] left-[20%] w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-24 bg-[#0F2A4A] text-white/60">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-16">
        <div>
          <div className="flex items-center gap-0.5 mb-8">
            <span className="font-display text-2xl text-white">Yog</span>
            <span className="font-ui font-medium text-2xl text-[var(--accent)]">AI</span>
          </div>
          <p className="text-sm leading-relaxed">Nền tảng hòa quyện công nghệ AI và truyền thống Yoga để kiến tạo sức khỏe bền vững.</p>
        </div>
        
        {['Sản phẩm', 'Công ty', 'Hỗ trợ'].map((col, idx) => (
           <div key={idx}>
             <h4 className="text-white font-ui font-bold text-sm uppercase tracking-widest mb-8">{col}</h4>
             <ul className="space-y-4">
               {['Tính năng', 'Bảng giá', 'Giảng viên', 'Lộ trình'].map(item => (
                 <li key={item}><Link href="#" className="text-sm hover:text-[var(--accent)] transition-colors">{item}</Link></li>
               ))}
             </ul>
           </div>
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-24 pt-8 border-t border-white/5 text-[10px] font-mono tracking-widest uppercase text-center">
        © 2026 YogAI. Đã đăng ký bản quyền. Phát triển bởi Advanced Agentic Coding Team.
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
