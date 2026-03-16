"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, CheckCircle2, ArrowRight, Star, Users,
  TrendingUp, Zap, Shield, BarChart3, Menu, X, Leaf,
  PlayCircle, Apple, Smartphone, User, Compass
} from "lucide-react";
import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd] selection:bg-indigo-100 selection:text-indigo-600">

      {/* ─── Premium Navbar ─── */}
      <header className="fixed top-0 z-[100] w-full border-b border-slate-50 bg-white/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white group-hover:scale-105 transition-transform duration-500 shadow-xl shadow-slate-200">
              <img src="/YogAI-logo.png" alt="YogAI Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-slate-900 text-3xl tracking-tighter">YogAI</span>
          </Link>

          {/* Main Navigation */}
          <nav className="hidden items-center gap-4 lg:flex">
            {["Tính năng", "Lộ trình AI", "Bảng giá", "Giáo viên"].map((item, i) => (
              <Link
                key={item}
                href={`#${["features", "ai-journey", "pricing", "teachers"][i]}`}
                className="px-6 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:block">
              <Button variant="ghost" className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">Đăng nhập</Button>
            </Link>
            <Link href="/signup">
              <Button className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200 transition-all active:scale-95">
                Bắt đầu ngay
              </Button>
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-3 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu Overlay */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
            {["Tính năng", "Lộ trình AI", "Bảng giá", "Giáo viên"].map((item, i) => (
              <Link key={item} href={`#${["features", "ai-journey", "pricing", "teachers"][i]}`}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-4 text-sm font-black uppercase tracking-widest text-slate-900 border-b border-slate-50 last:border-none">
                {item}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-4">
              <Link href="/login"><Button variant="outline" className="w-full h-14 rounded-2xl font-black uppercase">Đăng nhập</Button></Link>
              <Link href="/signup"><Button className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black uppercase">Bắt đầu ngay</Button></Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 pt-20">

        {/* Hero Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <HeroSection />
        </div>

        {/* Social Proof Bar */}
        <section className="py-12 border-y border-slate-50 bg-[#fcfcfc]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-between items-center gap-8 md:px-12">
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-slate-900 leading-none">2,400+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Học viên tích cực</span>
              </div>
              <div className="w-[1px] h-12 bg-slate-100 hidden md:block" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-slate-900 leading-none">180+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giáo viên chuyên môn</span>
              </div>
              <div className="w-[1px] h-12 bg-slate-100 hidden md:block" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-slate-900 leading-none">98%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Độ hài lòng AI</span>
              </div>
              <div className="w-[1px] h-12 bg-slate-100 hidden md:block" />
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-black text-slate-900 leading-none">4.9/5</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Đánh giá ứng dụng</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-50/50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-20 space-y-6">
              <Badge className="bg-sky-50 text-sky-700 border-none font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-full">
                Hệ sinh thái thông minh
              </Badge>
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-[0.95]">
                Mọi thứ bạn cần cho một <br />
                <span className="text-indigo-600">cơ thể khỏe mạnh.</span>
              </h2>
              <p className="text-lg font-medium text-slate-400 leading-relaxed">
                YogAI không chỉ là ứng dụng đặt lớp, mà là một cộng sự thấu hiểu cơ thể bạn qua từng hơi thở và chuyển động.
              </p>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                title="Cá nhân hóa bởi AI"
                description="Hệ thống học máy phân tích hơn 12 chỉ báo sức khỏe để kiến tạo lộ trình luyện tập độc bản dành riêng cho bạn."
              />
              <FeatureCard
                title="Theo dõi Tiến trình"
                description="Biểu đồ trực quan hóa độ dẻo dai, sức mạnh và mức độ phục hồi. Xem sự thay đổi của bản thân qua từng ngày."
              />
              <FeatureCard
                title="Quản trị Chuyên sâu"
                description="Dành cho giáo viên: Am hiểu học viên hơn bao giờ hết với dữ liệu sức khỏe và ghi chú tập luyện tập trung."
              />
              <FeatureCard
                title="Đặt lịch Thông minh"
                description="Tìm lớp học dựa trên cường độ mong muốn, thời gian biểu và trình độ hiện tại của bạn chỉ với một lần chạm."
              />
              <FeatureCard
                title="Mentor Chuyên nghiệp"
                description="Kết nối với cộng đồng giáo viên uy tín, được xác thực bằng bằng cấp và đánh giá thực tế từ cộng đồng."
              />
              <FeatureCard
                title="Trải nghiệm Đa nền"
                description="Đồng bộ hóa dữ liệu luyện tập trên mọi thiết bị, giúp bạn duy trì thói quen dù ở bất cứ nơi đâu."
              />
            </div>
          </div>
        </section>

        {/* Comparison Section - Premium Visuals */}
        <section id="ai-journey" className="py-32 bg-slate-900 text-white rounded-[4rem] mx-4 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <Sparkles className="w-96 h-96" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <Badge className="bg-white/10 text-sky-300 border-none font-black uppercase tracking-widest text-[10px] py-1.5 px-4">
                    Cuộc cách mạng Yoga
                  </Badge>
                  <h2 className="text-5xl font-black tracking-tighter leading-[0.95]">
                    Yoga cổ điển, <br />
                    Kỷ nguyên số.
                  </h2>
                  <p className="text-lg font-medium text-slate-400 leading-relaxed">
                    Chúng tôi loại bỏ sự phỏng đoán trong tập luyện. Không còn những lớp học quá sức hay những bài tập không hiệu quả.
                  </p>
                </div>

                <div className="space-y-8">
                  {[
                    { title: "Chính xác tuyệt đối", desc: "Mỗi tư thế được đề xuất đều có lý do khoa học đằng sau." },
                    { title: "Thấu hiểu nhu cầu", desc: "Giáo viên biết bạn cần gì trước khi buổi tập bắt đầu." },
                    { title: "Duy trì động lực", desc: "Tiến độ rõ ràng là liều thuốc tốt nhất cho sự kiên trì." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-sky-400">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-black">{item.title}</h4>
                        <p className="text-sm font-medium text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-10 bg-sky-500 rounded-full blur-[100px] opacity-20" />
                <div className="rounded-[3rem] p-12 bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Dự báo tiến độ</p>
                      <h4 className="text-xl font-black">Mục tiêu tháng 10</h4>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-900/40">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2">
                        <span>Hóa giải Căng thẳng</span>
                        <span className="text-sky-400">88%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-400 rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                    <div className="space-y-2 text-center p-8 rounded-3xl bg-white/5 border border-white/5">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Insight từ AI</p>
                      <p className="text-sm font-medium italic text-slate-300">"Sự linh hoạt cột sống của bạn đã cải thiện 14% so với tuần trước. Hãy duy trì cường độ này."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI System Explanation - How it Works */}
        <section id="how-it-works" className="py-32 bg-white relative overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-6 mb-24">
              <Badge className="bg-sky-50 text-sky-700 border-none font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-full">
                Lộ trình 4 bước
              </Badge>
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Cách YogAI vận hành
              </h2>
              <p className="text-lg font-medium text-slate-400 max-w-xl">
                Hệ thống thông minh của chúng tôi kết nối dữ liệu cơ thể bạn với chuyên môn của giáo viên.
              </p>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />

              <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { step: "01", icon: User, title: "Khởi tạo hồ sơ", desc: "Học viên cung cấp các chỉ số cơ thể, mục tiêu và tình trạng sức khỏe." },
                  { step: "02", icon: Sparkles, title: "Phân tích AI", desc: "AI phân tích dữ liệu để hiểu rõ giới hạn và tiềm năng của bạn." },
                  { step: "03", icon: Compass, title: "Đề xuất tối ưu", desc: "Hệ thống gợi ý các lớp học và cường độ tập luyện phù hợp nhất." },
                  { step: "04", icon: TrendingUp, title: "Theo dõi & Điều chỉnh", desc: "Giáo viên cập nhật tiến độ, AI tinh chỉnh lại lộ trình hàng tuần." }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-6 group">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-[2.5rem] bg-white border border-slate-100 flex items-center justify-center shadow-xl group-hover:shadow-indigo-100 group-hover:-translate-y-2 transition-all duration-500 relative z-10">
                        <item.icon className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs z-20 shadow-lg">
                        {item.step}
                      </div>
                    </div>
                    <div className="space-y-3 px-4">
                      <h4 className="text-xl font-black text-slate-900">{item.title}</h4>
                      <p className="text-sm font-medium text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section id="pricing" className="py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-6 mb-20">
              <Badge className="bg-indigo-50 text-indigo-700 border-none font-black uppercase tracking-widest text-[10px] py-1.5 px-4 rounded-full">
                Lựa chọn gói tập
              </Badge>
              <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">
                Đầu tư cho chính mình.
              </h2>
              <p className="text-lg font-medium text-slate-400 max-w-xl">
                Bắt đầu hành trình hoàn toàn miễn phí, nâng cấp khi bạn thực sự sẵn sàng tối ưu hóa luyện tập.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-3 max-w-6xl mx-auto">
              {/* Basic */}
              <div className="rounded-[3rem] p-10 bg-white border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col">
                <div className="mb-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Free Forever</p>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Cơ bản</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900">0đ</span>
                    <span className="text-slate-400 font-bold">/tháng</span>
                  </div>
                </div>
                <div className="space-y-5 mb-12 flex-1">
                  {["Đề xuất 3 lớp học/tuần", "Biểu đồ tiến độ cơ bản", "Hồ sơ sức khỏe tiêu chuẩn", "Đặt lịch lớp học"].map((f) => (
                    <div key={f} className="flex gap-4 items-center">
                      <div className="h-5 w-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">{f}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="h-14 w-full rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-100 text-slate-400 hover:text-slate-900">Bắt đầu ngay</Button>
              </div>

              {/* Pro - Featured */}
              <div className="relative rounded-[3rem] p-1 bg-gradient-to-br from-indigo-500 to-sky-500 shadow-2xl shadow-indigo-100 transform md:-translate-y-6">
                <div className="bg-white rounded-[2.8rem] p-10 h-full flex flex-col">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                    Phổ biến nhất
                  </div>
                  <div className="mb-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">Unlimited Potential</p>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Chuyên nghiệp</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-slate-900">199k</span>
                      <span className="text-slate-400 font-bold">/tháng</span>
                    </div>
                  </div>
                  <div className="space-y-5 mb-12 flex-1">
                    {["Gợi ý AI không giới hạn", "Phân tích sức khỏe nâng cao", "Ưu tiên đặt chỗ sớm", "Lịch sử luyện tập chi tiết", "Tư vấn chuyên khảo bởi AI"].map((f) => (
                      <div key={f} className="flex gap-4 items-center">
                        <div className="h-5 w-5 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                        </div>
                        <span className="text-sm font-bold text-indigo-900/80">{f}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="h-14 w-full bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200">Nâng cấp Pro</Button>
                </div>
              </div>

              {/* Teacher/Studio */}
              <div className="rounded-[3rem] p-10 bg-white border border-slate-50 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col">
                <div className="mb-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Master the Room</p>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">Giáo viên</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-slate-900">499k</span>
                    <span className="text-slate-400 font-bold">/tháng</span>
                  </div>
                </div>
                <div className="space-y-5 mb-12 flex-1">
                  {["Quản lý học viên không giới hạn", "Dashboard phân tích HV", "Hệ thống báo cáo buổi tập", "Công cụ SEO giáo viên", "Hỗ trợ 24/7 VIP"].map((f) => (
                    <div key={f} className="flex gap-4 items-center">
                      <div className="h-5 w-5 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-600">{f}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="h-14 w-full rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-100 text-slate-400 hover:text-slate-900">Liên hệ tư vấn</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Strip */}
        <section className="py-24 px-4">
          <div className="mx-auto max-w-7xl rounded-[4rem] bg-indigo-600 p-12 sm:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-100">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-sky-600 -z-10" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-3xl mx-auto space-y-10 relative z-10">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                  <Sparkles className="w-10 h-10" />
                </div>
              </div>
              <h2 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none">
                Lắng nghe cơ thể bạn <br /> theo cách <span className="text-sky-300 italic">mới.</span>
              </h2>
              <p className="text-lg font-bold text-indigo-100/80 max-w-xl mx-auto">
                Chỉ cần 2 phút để khởi tạo hành trình cá nhân hóa. Không cần thẻ tín dụng, chỉ cần đam mê.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/signup">
                  <Button className="h-16 px-12 text-indigo-600 hover:bg-slate-50 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-black/10 active:scale-95 transition-all">
                    Đăng ký miễn phí
                  </Button>
                </Link>
                <div className="flex gap-4">
                  <Button variant="ghost" className="h-16 w-16 p-0 bg-white/10 hover:bg-white/20 text-white rounded-2xl border-none">
                    <Apple className="w-6 h-6" />
                  </Button>
                  <Button variant="ghost" className="h-16 w-16 p-0 bg-white/10 hover:bg-white/20 text-white rounded-2xl border-none">
                    <Smartphone className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
