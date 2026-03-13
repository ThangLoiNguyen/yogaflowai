import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star, Users, Clock, Award, BookOpen,
  CalendarCheck, MessageCircle, TrendingUp, ExternalLink, Sparkles, Heart
} from "lucide-react";

const TEACHER = {
  name: "Leah Nguyen",
  avatar: "🧘‍♀️",
  title: "Giáo viên Yoga & Wellness Coach",
  bio: "Với hơn 8 năm kinh nghiệm dạy yoga, Leah chuyên sâu về Hatha, Vinyasa và yoga phục hồi. Cô được chứng nhận RYT-500 và đã đào tạo hàng trăm học viên trên con đường tìm kiếm sự cân bằng qua yoga.",
  specialties: ["Hatha Yoga", "Vinyasa Flow", "Yoga Phục hồi", "Pranayama", "Thiền định"],
  certifications: ["RYT-500 (Yoga Alliance)", "Trauma-Informed Yoga", "Pre & Postnatal Yoga"],
  stats: {
    students: 248,
    classes: 1240,
    years: 8,
    rating: 4.97,
    reviews: 186,
  },
};

const CLASSES = [
  { id: "c-1", name: "Grounded Morning Flow", intensity: "Nhẹ nhàng", duration: "45 phút", level: "Level 1–2", schedule: "T2, T4, T6 • 7:00 SA", spots: 2, rating: 4.9 },
  { id: "c-2", name: "Vinyasa Essentials", intensity: "Trung bình", duration: "55 phút", level: "Level 2", schedule: "T3, T7 • 6:30 CH", spots: 5, rating: 4.8 },
  { id: "c-3", name: "Evening Unwind", intensity: "Nhẹ nhàng", duration: "40 phút", level: "Tất cả cấp độ", schedule: "T5 • 8:00 CH", spots: 0, rating: 5.0 },
];

const REVIEWS = [
  { name: "Maya P.", avatar: "👩", rating: 5, date: "2 tuần trước", text: "Leah thật sự thay đổi cách tôi nhìn nhận yoga. Lớp Morning Flow của cô ấy giúp tôi bắt đầu ngày mới hoàn toàn khác biệt." },
  { name: "Alex C.", avatar: "🧑", rating: 5, date: "1 tháng trước", text: "Phong cách dạy của Leah rất rõ ràng và chu đáo. Cô ấy chú ý đến từng học viên và điều chỉnh kịp thời." },
  { name: "Jordan R.", avatar: "🧒", rating: 4, date: "6 tuần trước", text: "Lớp Vinyasa Essentials rất phù hợp cho người muốn nâng lên Level 2. Được hướng dẫn tỉ mỉ từng động tác." },
];

const intensityColor: Record<string, string> = {
  "Nhẹ nhàng": "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/40",
  "Trung bình": "bg-sky-50 text-sky-700 border-sky-200/60 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800/40",
  "Năng động": "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/40",
};

export default function TeacherProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav role="student" />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 space-y-8">

          {/* ─── Profile Card ─── */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            {/* Top gradient band */}
            <div className="h-24 bg-gradient-to-r from-indigo-100 via-sky-100 to-cyan-100 dark:from-indigo-950/40 dark:via-sky-950/30 dark:to-cyan-950/20" />

            <CardContent className="relative -mt-12 px-6 pb-6">
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div className="flex items-end gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white dark:border-slate-900 bg-gradient-to-tr from-indigo-100 to-sky-100 dark:from-indigo-950 dark:to-sky-950 shadow-md text-3xl">
                    {TEACHER.avatar}
                  </div>
                  <div className="pb-1 space-y-0.5">
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">{TEACHER.name}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{TEACHER.title}</p>
                    <div className="flex items-center gap-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(TEACHER.stats.rating) ? "fill-amber-400 text-amber-400" : "text-slate-200 dark:text-slate-700"}`} />
                      ))}
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">{TEACHER.stats.rating}</span>
                      <span className="text-xs text-slate-400">({TEACHER.stats.reviews} đánh giá)</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 font-semibold shadow-sm active:scale-95">
                    <Heart className="w-4 h-4 mr-1.5" /> Theo dõi
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-700 font-semibold">
                    <MessageCircle className="w-4 h-4 mr-1.5" /> Nhắn tin
                  </Button>
                </div>
              </div>

              {/* Bio */}
              <p className="mt-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                {TEACHER.bio}
              </p>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Học viên", value: TEACHER.stats.students, icon: Users, color: "text-sky-500" },
                  { label: "Lớp đã dạy", value: TEACHER.stats.classes, icon: BookOpen, color: "text-indigo-500" },
                  { label: "Năm kinh nghiệm", value: TEACHER.stats.years, icon: Award, color: "text-amber-500" },
                  { label: "Tỷ lệ hoàn thành", value: "94%", icon: TrendingUp, color: "text-emerald-500" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50 p-4 text-center">
                    <Icon className={`w-5 h-5 ${color} mx-auto mb-1.5`} />
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">{value}</p>
                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ─── Specialties & Certs ─── */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  Chuyên môn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {TEACHER.specialties.map(s => (
                    <span key={s} className="rounded-full border border-indigo-200/60 bg-indigo-50/50 dark:border-indigo-800/40 dark:bg-indigo-900/20 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                      {s}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Award className="w-4 h-4 text-amber-500" />
                  Chứng chỉ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {TEACHER.certifications.map(c => (
                  <div key={c} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="font-medium">{c}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ─── Classes ─── */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-sky-500" />
              Lớp học đang dạy
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CLASSES.map(cls => (
                <div key={cls.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all group">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{cls.name}</h3>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold shrink-0 ${intensityColor[cls.intensity] || ""}`}>
                      {cls.intensity}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {cls.duration} · {cls.level}</div>
                    <div className="flex items-center gap-1.5"><CalendarCheck className="w-3 h-3" /> {cls.schedule}</div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {cls.rating}
                      <span className={`ml-auto font-bold text-[11px] ${cls.spots === 0 ? "text-rose-500" : cls.spots <= 2 ? "text-amber-500" : "text-emerald-500"}`}>
                        {cls.spots === 0 ? "Hết chỗ" : `${cls.spots} chỗ trống`}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    disabled={cls.spots === 0}
                    className={`w-full font-semibold h-9 transition-all active:scale-95 ${
                      cls.spots === 0
                        ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed"
                        : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm"
                    }`}
                  >
                    {cls.spots === 0 ? "Hết chỗ" : "Đặt lớp"}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Reviews ─── */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              Đánh giá học viên
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REVIEWS.map((r, i) => (
                <div key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{r.avatar}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{r.name}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="font-semibold border-slate-200 dark:border-slate-700 gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Xem tất cả {TEACHER.stats.reviews} đánh giá
              </Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
