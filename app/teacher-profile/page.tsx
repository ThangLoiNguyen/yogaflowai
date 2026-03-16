"use client";

import { DashboardNav } from "@/components/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Star, Users, Clock, Award, BookOpen,
  CalendarCheck, MessageCircle, TrendingUp, ExternalLink, Sparkles, Heart,
  ArrowRight, ShieldCheck, Instagram
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
  { id: "c-1", name: "Grounded Morning Flow", intensity: "Nhẹ nhàng", duration: "45 phút", level: "Cấp độ 1–2", schedule: "T2, T4, T6 • 7:00 SA", spots: 2, rating: 4.9 },
  { id: "c-2", name: "Vinyasa Essentials", intensity: "Trung bình", duration: "55 phút", level: "Trung cấp", schedule: "T3, T7 • 6:30 CH", spots: 5, rating: 4.8 },
  { id: "c-3", name: "Evening Unwind", intensity: "Nhẹ nhàng", duration: "40 phút", level: "Mọi cấp độ", schedule: "T5 • 8:00 CH", spots: 0, rating: 5.0 },
];

const REVIEWS = [
  { name: "Maya P.", avatar: "👩", rating: 5, date: "2 tuần trước", text: "Leah thật sự thay đổi cách tôi nhìn nhận yoga. Lớp Morning Flow của cô ấy giúp tôi bắt đầu ngày mới hoàn toàn khác biệt." },
  { name: "Alex C.", avatar: "🧑", rating: 5, date: "1 tháng trước", text: "Phong cách dạy của Leah rất rõ ràng và chu đáo. Cô ấy chú ý đến từng học viên và điều chỉnh kịp thời." },
  { name: "Jordan R.", avatar: "🧒", rating: 4, date: "6 tuần trước", text: "Lớp Vinyasa Essentials rất phù hợp cho người muốn nâng lên Level 2. Được hướng dẫn tỉ mỉ từng động tác." },
];

const intensityStyles: Record<string, string> = {
  "Nhẹ nhàng": "bg-emerald-50 text-emerald-600 border-emerald-100",
  "Trung bình": "bg-sky-50 text-sky-600 border-sky-100",
  "Năng động": "bg-amber-50 text-amber-600 border-amber-100",
};

export default function TeacherProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd]">
      <DashboardNav role="student" />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12 animate-soft-fade">

          {/* ─── Profile Header ─── */}
          <div className="relative rounded-[3rem] bg-indigo-600 p-1 bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-2xl shadow-indigo-100 border-none overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
                <Sparkles className="w-48 h-48" />
             </div>
             
             <div className="bg-white rounded-[2.8rem] p-8 sm:p-12 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                   {/* Left Col: Avatar & Badge */}
                   <div className="shrink-0 space-y-6">
                      <div className="relative group">
                         <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-6xl shadow-xl transition-transform group-hover:scale-105 duration-500">
                            {TEACHER.avatar}
                         </div>
                         <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
                            <ShieldCheck className="w-5 h-5" />
                         </div>
                      </div>
                      <div className="space-y-3">
                         <Badge className="bg-emerald-50 text-emerald-600 border-none font-black uppercase tracking-widest text-[9px] py-1.5 px-3">
                            Verfied Mentor
                         </Badge>
                         <div className="flex gap-3">
                            <Button size="icon" variant="outline" className="h-10 w-10 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                               <Instagram className="w-4 h-4 text-slate-400" />
                            </Button>
                            <Button size="icon" variant="outline" className="h-10 w-10 border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                               <ExternalLink className="w-4 h-4 text-slate-400" />
                            </Button>
                         </div>
                      </div>
                   </div>

                   {/* Right Col: Bio & Quick Stats */}
                   <div className="flex-1 space-y-6">
                      <div className="space-y-4">
                         <h1 className="text-5xl font-black tracking-tighter text-slate-900">{TEACHER.name}</h1>
                         <p className="text-lg font-bold text-indigo-600">{TEACHER.title}</p>
                         <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">{TEACHER.bio}</p>
                      </div>

                      <div className="flex flex-wrap gap-10 pt-4">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Học viên</p>
                            <p className="text-2xl font-black text-slate-900">{TEACHER.stats.students}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Lớp đã dạy</p>
                            <p className="text-2xl font-black text-slate-900">{TEACHER.stats.classes}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Kinh nghiệm</p>
                            <p className="text-2xl font-black text-slate-900">{TEACHER.stats.years} Năm</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Đánh giá khách hàng</p>
                            <div className="flex items-center gap-2">
                               <p className="text-2xl font-black text-slate-900">{TEACHER.stats.rating}</p>
                               <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            </div>
                         </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                         <Button className="h-14 px-10 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-indigo-100 active:scale-95 transition-all">
                            Theo dõi lộ trình
                         </Button>
                         <Button variant="ghost" className="h-14 px-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all">
                            Nhắn tin trực tiếp
                         </Button>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* ─── Specialties & Certifications ─── */}
          <div className="grid lg:grid-cols-2 gap-10">
             <Card className="rounded-[2.5rem] p-10 bg-white border-slate-100 shadow-sm border-none">
                <CardHeader className="px-0 pt-0 pb-6">
                   <div className="flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-indigo-500" />
                      <CardTitle className="text-2xl font-black text-slate-900">Chuyên môn giảng dạy</CardTitle>
                   </div>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                   <div className="flex flex-wrap gap-3">
                      {TEACHER.specialties.map(s => (
                         <Badge key={s} className="bg-slate-50 text-slate-600 border-none font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-tight">
                            {s}
                         </Badge>
                      ))}
                   </div>
                </CardContent>
             </Card>

             <Card className="rounded-[2.5rem] p-10 bg-white border-slate-100 shadow-sm border-none">
                <CardHeader className="px-0 pt-0 pb-6">
                   <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-amber-500" />
                      <CardTitle className="text-2xl font-black text-slate-900">Bằng cấp & Chứng chỉ</CardTitle>
                   </div>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-4">
                   {TEACHER.certifications.map(c => (
                      <div key={c} className="flex items-center gap-4 group">
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:scale-150 transition-transform" />
                         <span className="text-sm font-bold text-slate-600">{c}</span>
                      </div>
                   ))}
                </CardContent>
             </Card>
          </div>

          {/* ─── Current Classes ─── */}
          <div className="space-y-8">
             <div className="flex items-end justify-between">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                      <CalendarCheck className="w-6 h-6 text-sky-500" />
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Lịch giảng dạy</h2>
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-9">Khám phá các lớp học sắp tới của Leah</p>
                </div>
                <Button variant="ghost" className="font-black text-indigo-600 uppercase tracking-widest text-[11px]">Xem cả tháng</Button>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {CLASSES.map(cls => (
                   <div key={cls.id} className="group rounded-[2.5rem] border border-slate-50 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col">
                      <div className="flex items-start justify-between mb-6">
                         <h3 className="font-black text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{cls.name}</h3>
                         <Badge className={`border-none font-black text-[9px] uppercase px-2.5 py-1 ${intensityStyles[cls.intensity]}`}>
                            {cls.intensity}
                         </Badge>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                         <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-slate-300" />
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{cls.duration} • {cls.level}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <CalendarCheck className="w-4 h-4 text-sky-400" />
                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{cls.schedule}</span>
                         </div>
                         <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-1.5">
                               <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                               <span className="text-xs font-black text-slate-900">{cls.rating}</span>
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${cls.spots === 0 ? "text-rose-500" : "text-emerald-500"}`}>
                               {cls.spots === 0 ? "FULL" : `${cls.spots} Chỗ trống`}
                            </span>
                         </div>
                      </div>
                      
                      <Button 
                         disabled={cls.spots === 0}
                         className={`mt-auto w-full h-14 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg transition-all active:scale-95 ${
                            cls.spots === 0 ? "bg-slate-50 text-slate-300" : "bg-slate-900 text-white hover:bg-slate-800"
                         }`}
                      >
                         {cls.spots === 0 ? "ĐÃ HẾT CHỖ" : "ĐẶT CHỖ NGAY"}
                      </Button>
                   </div>
                ))}
             </div>
          </div>

          {/* ─── Reviews ─── */}
          <div className="space-y-8">
             <div className="flex items-end justify-between">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                      <Heart className="w-6 h-6 text-rose-500" />
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Học viên nói gì</h2>
                   </div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-9">Phản hồi từ {TEACHER.stats.reviews} học viên tích cực</p>
                </div>
             </div>

             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {REVIEWS.map((r, i) => (
                   <div key={i} className="rounded-[2.5rem] bg-slate-50/50 p-8 space-y-6 border border-slate-50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm">
                               {r.avatar}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900">{r.name}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.date}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-0.5">
                            {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                         </div>
                      </div>
                      <p className="text-[13px] font-medium text-slate-500 leading-relaxed italic">"{r.text}"</p>
                   </div>
                ))}
             </div>
             
             <div className="flex justify-center pt-4">
                 <Button variant="outline" className="h-14 px-10 border-slate-100 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all">
                    Xem tất cả lượt đánh giá <ArrowRight className="w-4 h-4 ml-3" />
                 </Button>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
