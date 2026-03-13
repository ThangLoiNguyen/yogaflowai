"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sparkles, CheckCircle2, ArrowRight, Star, Users, TrendingUp, Zap, Shield, BarChart3, Menu, X } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
      {/* ─── Navbar ─── */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-500 shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">YogaFlow AI</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {["Tính năng", "Sản phẩm", "Bảng giá"].map((item, i) => (
              <Link
                key={item}
                href={`#${["features", "product", "pricing"][i]}`}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost" size="sm" className="text-sm font-medium">Đăng nhập</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="hidden md:flex bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 font-semibold shadow-sm">
                Bắt đầu miễn phí
              </Button>
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-2">
            {["Tính năng", "Sản phẩm", "Bảng giá"].map((item, i) => (
              <Link key={item} href={`#${["features", "product", "pricing"][i]}`}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                {item}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link href="/login"><Button variant="outline" className="w-full">Đăng nhập</Button></Link>
              <Link href="/signup"><Button className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">Bắt đầu miễn phí</Button></Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden border-b border-slate-100 dark:border-slate-800/50 bg-gradient-to-b from-white via-sky-50/30 to-white dark:from-slate-950 dark:via-indigo-950/10 dark:to-slate-950">
          {/* BG glows */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-sky-400/10 dark:bg-sky-500/5 blur-3xl" />
          <div className="pointer-events-none absolute top-20 right-0 h-72 w-72 rounded-full bg-indigo-400/10 dark:bg-indigo-500/5 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="space-y-8 text-left">
                <Badge className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20 px-3 py-1.5 text-xs font-semibold rounded-full">
                  <Sparkles className="h-3.5 w-3.5" />
                  Nền tảng yoga AI đầu tiên tại Việt Nam
                </Badge>

                <div className="space-y-5">
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl leading-tight">
                    Yoga thông minh hơn.{" "}
                    <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                      Chuyên biệt cho bạn.
                    </span>
                  </h1>
                  <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    YogaFlow AI phân tích sức khỏe, mục tiêu và thói quen tập luyện của bạn để đề xuất lớp học phù hợp nhất — chính xác như một huấn luyện viên cá nhân.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/signup">
                    <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 font-semibold shadow-md px-6 transition-transform active:scale-95">
                      Bắt đầu miễn phí
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/teacher-dashboard">
                    <Button size="lg" variant="outline" className="font-semibold border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                      Tôi là giáo viên
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {["Không cần thẻ tín dụng", "Khảo sát chỉ 2 phút", "Miễn phí trọn đời"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {t}
                    </span>
                  ))}
                </div>

                {/* Social proof */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex -space-x-2">
                    {["🧘‍♀️", "🧘‍♂️", "🧘", "🧘‍♀️"].map((e, i) => (
                      <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-slate-900 bg-gradient-to-tr from-sky-100 to-indigo-100 dark:from-slate-800 dark:to-slate-700 text-sm">
                        {e}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Được 2,400+ học viên tin dùng</p>
                  </div>
                </div>
              </div>

              {/* Dashboard preview card */}
              <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/20 overflow-hidden dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/50">
                {/* top bar */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">YogaFlow AI · Dashboard</span>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">● Live</span>
                </div>
                <div className="p-5 space-y-4">
                  {/* Metric row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Độ dẻo dai", value: "78%", color: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-500/10" },
                      { label: "Cân bằng", value: "65%", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
                      { label: "Phục hồi", value: "92%", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
                    ].map((m) => (
                      <div key={m.label} className={`rounded-xl ${m.bg} p-3 text-center`}>
                        <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                        <p className="mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* AI Rec card */}
                  <div className="rounded-xl border border-indigo-100/80 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-950/30 p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-500" />
                      <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide">AI đề xuất hôm nay</span>
                      <span className="ml-auto text-[10px] font-semibold bg-indigo-500 text-white px-2 py-0.5 rounded-full">96% phù hợp</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Grounded Morning Flow</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">45 phút • Cấp độ 1–2 • Nhẹ nhàng</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-300 leading-relaxed">Phù hợp để mở hông và phục hồi căng thẳng dựa trên dữ liệu sức khỏe hôm nay của bạn.</p>
                  </div>
                  {/* Progress bars */}
                  <div className="space-y-2.5">
                    {[
                      { label: "Tiến độ tuần này", value: 75, color: "bg-sky-400" },
                      { label: "Hoàn thành mục tiêu", value: 60, color: "bg-indigo-400" },
                    ].map((b) => (
                      <div key={b.label}>
                        <div className="flex justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">
                          <span>{b.label}</span><span>{b.value}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Logos / Social proof bar ─── */}
        <section className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 py-8">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Được tin dùng bởi học viên & giáo viên</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50 dark:opacity-30">
              {["2,400+ Học viên", "180+ Giáo viên", "98% Hài lòng", "4.9★ Đánh giá"].map((t) => (
                <span key={t} className="text-sm font-bold text-slate-600 dark:text-slate-300">{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section id="features" className="py-24 border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 max-w-2xl space-y-4">
              <Badge className="bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/20 font-semibold">
                Tính năng nổi bật
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Được xây dựng cho hành trình yoga thực sự
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Từ gợi ý AI cá nhân hóa đến phân tích sức khỏe chi tiết — mọi thứ bạn cần để tập yoga đúng cách.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Sparkles, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10",
                  title: "AI Gợi ý lớp học",
                  desc: "Phân tích 12+ chỉ số sức khỏe và lịch sử tập luyện để đề xuất lớp học phù hợp nhất — mỗi ngày một gợi ý mới.",
                },
                {
                  icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10",
                  title: "Theo dõi tiến độ chi tiết",
                  desc: "Biểu đồ trực quan về độ dẻo dai, sức cân bằng, mức độ căng thẳng và tỷ lệ chuyên cần qua từng tuần.",
                },
                {
                  icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10",
                  title: "Dashboard giáo viên",
                  desc: "Xem ngay ai sẵn sàng nâng cao, ai cần lớp phục hồi. Quản lý toàn bộ studio từ một bảng điều khiển duy nhất.",
                },
                {
                  icon: Zap, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10",
                  title: "Đặt lớp nhanh chóng",
                  desc: "Màn hình khám phá lớp học có bộ tìm kiếm và bộ lọc thông minh. Đăng ký chỉ với một cú nhấp chuột.",
                },
                {
                  icon: Users, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10",
                  title: "Hồ sơ giáo viên",
                  desc: "Xem chứng chỉ, đánh giá sao, số học viên đã dạy và lịch dạy của từng giáo viên trước khi đăng ký.",
                },
                {
                  icon: Shield, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10",
                  title: "Bảo mật & Riêng tư",
                  desc: "Dữ liệu sức khỏe của bạn được mã hóa và không bao giờ được chia sẻ với bên thứ ba mà không có sự đồng ý.",
                },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 dark:hover:border-slate-700">
                  <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
                    <Icon className={`h-5 w-5 ${color}`} />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Problem / Solution ─── */}
        <section id="product" className="py-24 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 space-y-4 text-center">
              <Badge className="bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-500/20 font-semibold">
                Tại sao YogaFlow AI?
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Chấm dứt việc tập yoga theo kiểu đoán mò
              </h2>
            </div>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="rounded-2xl border border-rose-200/60 bg-rose-50/60 dark:border-rose-900/30 dark:bg-rose-950/20 p-8 space-y-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">😰 Trước đây</h3>
                <ul className="space-y-4">
                  {[
                    "Không biết nên chọn lớp nào phù hợp với thể trạng", 
                    "Tiến độ không rõ ràng, khó đo lường sự cải thiện",
                    "Giáo viên không biết học viên đang gặp khó khăn gì",
                    "Bỏ cuộc sau vài tuần vì thiếu động lực và định hướng",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="mt-0.5 text-rose-400 shrink-0">✗</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/60 dark:border-emerald-900/30 dark:bg-emerald-950/20 p-8 space-y-5">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">✨ Với YogaFlow AI</h3>
                <ul className="space-y-4">
                  {[
                    "AI gợi ý lớp học phù hợp chính xác với sức khỏe & mục tiêu",
                    "Biểu đồ tiến độ chi tiết theo tuần, dễ nhìn dễ hiểu",
                    "Giáo viên nhận insight thông minh về từng học viên",
                    "Gamification & huy hiệu giúp duy trì động lực lâu dài",
                  ].map((t) => (
                    <li key={t} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Pricing ─── */}
        <section id="pricing" className="py-24 border-b border-slate-100 dark:border-slate-800">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-14 space-y-4 text-center">
              <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20 font-semibold">
                Bảng giá
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Đơn giản. Minh bạch. Không ẩn phí.
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
                Bắt đầu hoàn toàn miễn phí. Nâng cấp khi bạn đã sẵn sàng tối ưu hành trình yoga.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {/* Free */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900/50">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Cơ bản</p>
                  <p className="text-xs text-slate-500 mt-1">Dành cho học viên cá nhân</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white">Miễn phí</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">mãi mãi</p>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  {["Gợi ý lớp học AI cơ bản", "Theo dõi tiến độ cơ bản", "Tối đa 3 mục tiêu", "Đặt lớp học"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0"/>{f}</li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button variant="outline" className="w-full font-semibold">Bắt đầu miễn phí</Button>
                </Link>
              </div>

              {/* Pro — highlighted */}
              <div className="relative rounded-2xl border-2 border-indigo-500 bg-gradient-to-b from-indigo-50/80 to-white p-8 shadow-xl shadow-indigo-500/10 space-y-6 dark:from-indigo-950/40 dark:to-slate-900 dark:border-indigo-400/60 dark:shadow-indigo-900/30">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">Phổ biến nhất</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Chuyên nghiệp</p>
                  <p className="text-xs text-slate-500 mt-1">Cho học viên nghiêm túc</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white">$19<span className="text-lg font-normal text-slate-400">/tháng</span></p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">Tiết kiệm 40% với gói năm</p>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  {["Tất cả tính năng Cơ bản", "Gợi ý AI không giới hạn", "Phân tích sức khỏe chuyên sâu", "AI giải thích lý do đề xuất", "Tích hợp thiết bị đeo (sắp ra mắt)"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0"/>{f}</li>
                  ))}
                </ul>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md">Nâng cấp lên Pro</Button>
                </Link>
              </div>

              {/* Studio */}
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 dark:border-slate-800 dark:bg-slate-900/50">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Studio</p>
                  <p className="text-xs text-slate-500 mt-1">Dành cho giáo viên & studio</p>
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-slate-900 dark:text-white">$79<span className="text-lg font-normal text-slate-400">/tháng</span></p>
                  <p className="text-xs text-slate-400 mt-1">Thanh toán hàng tháng</p>
                </div>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  {["Dashboard giáo viên đầy đủ", "Phân tích từng học viên", "Hiệu suất lớp học chi tiết", "Hồ sơ học viên không giới hạn", "Hỗ trợ ưu tiên 24/7"].map((f) => (
                    <li key={f} className="flex items-center gap-2.5"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0"/>{f}</li>
                  ))}
                </ul>
                <Link href="/teacher-dashboard" className="block">
                  <Button variant="outline" className="w-full font-semibold border-slate-200 dark:border-slate-700">Liên hệ tư vấn</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Final CTA ─── */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
            <div className="space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-500 shadow-lg mx-auto">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Bắt đầu hành trình yoga của riêng bạn
              </h2>
              <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                Trả lời một vài câu hỏi và để YogaFlow AI tìm lớp học phù hợp nhất với cơ thể và mục tiêu của bạn.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 font-bold shadow-xl px-8 transition-transform active:scale-95">
                    Bắt đầu miễn phí
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/teacher-dashboard">
                  <Button size="lg" variant="outline" className="font-semibold border-slate-200 dark:border-slate-700">
                    Dành cho giáo viên
                  </Button>
                </Link>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">Không cần thẻ tín dụng • Khảo sát chỉ 2 phút • Miễn phí trọn đời gói cơ bản</p>
            </div>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-500">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">YogaFlow AI</span>
            </div>
            <p className="text-xs font-medium text-slate-400">© {new Date().getFullYear()} YogaFlow AI. Đã đăng ký bản quyền.</p>
            <div className="flex items-center gap-5 text-xs font-medium text-slate-500 dark:text-slate-400">
              {["Bảo mật", "Điều khoản", "Hỗ trợ"].map((t) => (
                <button key={t} className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors">{t}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
