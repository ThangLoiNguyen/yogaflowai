"use client";

import React, { useState, useEffect, useTransition } from "react";
import { 
  ArrowLeft, 
  Clock, 
  Map, 
  Star, 
  User, 
  CheckCircle,
  Video,
  Award,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const courseId = params?.id;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  useEffect(() => {
    if (courseId) fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    const { data, error } = await supabase
      .from("courses")
      .select(`
        *,
        users!teacher_id(full_name)
      `)
      .eq("id", courseId)
      .single();

    if (error) {
      console.error(error);
      toast.error("Không tìm thấy khoá học.");
      router.push("/student/explore");
    } else {
      const { data: reviewList } = await supabase
        .from("reviews")
        .select("rating")
        .eq("course_id", courseId);
        
      const validReviews = reviewList || [];
      const avgRating = validReviews.length > 0 ? validReviews.reduce((s: number, r: any) => s + r.rating, 0) / validReviews.length : null;
      setCourse({ ...data, avg_rating: avgRating, review_count: validReviews.length });
    }
    setLoading(false);
  };

  const handleEnroll = async () => {
    startTransition(async () => {
      try {
        const resp = await fetch("/api/checkout/create-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            courseId: course.id, 
            price: Number(course.price_per_session || 120000), 
            title: course.title 
          })
        });
        const data = await resp.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          throw new Error(data.error);
        }
      } catch (e: any) {
        toast.error("Lỗi thanh toán: " + e.message);
      }
    });
  };

  if (loading || !course) return <div className="p-20 text-center animate-pulse text-2xl font-black text-slate-200 uppercase tracking-widest italic">Đang tải khoá học...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-900 transition-colors group font-mono uppercase tracking-widest text-[10px] font-black"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại
      </button>

      <section className="grid md:grid-cols-12 gap-12 items-start">
         <div className="md:col-span-8 space-y-10">
            <div>
               <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-100 text-slate-400 text-[10px] font-mono font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
                  Cấp độ {course.level} · 60 phút
               </div>
               <h1 className="text-3xl lg:text-4xl mb-8 text-slate-900 border-none font-black italic">{course.title}</h1>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm flex items-center justify-center font-bold text-slate-300">
                        {(course.users as any)?.full_name?.[0] || "L"}
                     </div>
                     <div>
                        <div className="text-sm font-black text-slate-900 uppercase tracking-tight">GV. {(course.users as any)?.full_name || "Giảng viên"}</div>
                        <div className="text-[10px] uppercase text-slate-400 tracking-widest font-mono italic opacity-60">Giảng viên YogAI</div>
                     </div>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-100" />
                  {course.avg_rating != null ? (
                    <div className="flex items-center gap-2 text-sm font-black text-sky-500">
                       <Star className="w-4 h-4 fill-sky-500" />
                       {course.avg_rating.toFixed(1)} <span className="text-slate-400 font-mono font-normal text-[10px] ml-1 tracking-widest">({course.review_count})</span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-300 font-mono uppercase tracking-widest italic">Chưa có đánh giá</div>
                  )}
               </div>
            </div>

            <p className="text-lg lg:text-xl text-slate-500 leading-relaxed font-ui italic tracking-wide">
               "{course.description}"
            </p>

            <div className="space-y-8 pt-8">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 border-none font-mono italic">Lợi ích bài tập</h3>
               <div className="grid sm:grid-cols-2 gap-5">
                  {(course.goals || ["Dẻo dai", "Hơi thở", "Tĩnh tâm", "Cân bằng"]).map((f: string) => (
                    <div key={f} className="flex items-center gap-4 p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
                       <CheckCircle className="w-5 h-5 text-sky-500 opacity-60" />
                       <span className="text-sm font-bold text-slate-700 italic">{f}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="md:col-span-4 sticky top-12">
            <div className="p-6 bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl shadow-slate-100 space-y-10 group overflow-hidden relative">
               <div className="space-y-6 relative z-10">
                  <div className="text-[10px] uppercase text-slate-300 font-mono tracking-[0.2em] font-black opacity-60 leading-none">Thông tin khoá học</div>
                  <div className="space-y-4">
                     <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                        <Clock className="w-5 h-5 text-slate-300" />
                        <span>{course.sessions_per_week || 3} buổi / tuần</span>
                     </div>
                     <div className="flex items-center gap-4 text-sm font-bold text-slate-700">
                        <Video className="w-5 h-5 text-slate-300" />
                        <span>Học trực tuyến (LiveKit)</span>
                     </div>
                  </div>
               </div>

               <div className="h-[1px] bg-slate-50 relative z-10" />

               <div className="space-y-6 relative z-10">
                  <div className="flex items-baseline justify-between mb-4">
                     <span className="text-3xl font-black text-slate-900 italic">
                        {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price_per_session || 120000)}<span className="text-xs text-slate-400 font-normal italic ml-1">/b</span>
                     </span>
                  </div>
                  <Button 
                    onClick={handleEnroll}
                    disabled={isPending}
                    className="w-full h-12 lg:h-14 bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-[0.2em] text-[10px] lg:text-xs shadow-2xl shadow-sky-900/10 rounded-2xl active:scale-95 transition-all"
                  >
                    {isPending ? "Đang xử lý..." : "Đăng ký khóa học"}
                  </Button>
                  <Button variant="ghost" className="w-full h-10 text-slate-300 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest font-mono">Bao gồm 0đ phí dịch vụ</Button>
               </div>

               <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 flex gap-4 relative z-10">
                  <Zap className="w-6 h-6 text-sky-400 shrink-0" />
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic opacity-80">
                     AI đề xuất: Lớp này khớp 95% với hồ sơ của bạn. Feedback sẽ được gửi tới giáo viên tự động.
                  </p>
               </div>
               {/* Decoration */}
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            </div>
         </div>
      </section>

      <section className="bg-slate-50/50 border border-slate-100 rounded-[3rem] p-16 text-center space-y-16">
         <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-slate-300 border-none font-mono italic leading-none">Trải nghiệm cá nhân hóa</h3>
            <p className="text-xl lg:text-2xl font-black italic text-slate-900 leading-none">Hành trình thấu hiểu cơ thể cùng AI</p>
         </div>
         <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-6 group">
               <div className="w-14 h-14 rounded-3xl bg-white mx-auto shadow-sm flex items-center justify-center border border-slate-100 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
                  <Map className="w-7 h-7 text-slate-300 group-hover:text-white transition-colors" />
               </div>
               <div className="space-y-2">
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Lộ trình động</h4>
                  <p className="text-[12px] text-slate-400 leading-relaxed italic max-w-[200px] mx-auto opacity-70">AI điều chỉnh nội dung buổi tập dựa trên thể trạng của bạn.</p>
               </div>
            </div>
            <div className="space-y-6 group">
               <div className="w-14 h-14 rounded-3xl bg-white mx-auto shadow-sm flex items-center justify-center border border-slate-100 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
                  <Star className="w-7 h-7 text-slate-300 group-hover:text-white transition-colors" />
               </div>
               <div className="space-y-2">
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Giáo viên tận tâm</h4>
                  <p className="text-[12px] text-slate-400 leading-relaxed italic max-w-[200px] mx-auto opacity-70">Nhận những tư vấn chuyên sâu nhất từ giáo viên kinh nghiệm.</p>
               </div>
            </div>
            <div className="space-y-6 group">
               <div className="w-14 h-14 rounded-3xl bg-white mx-auto shadow-sm flex items-center justify-center border border-slate-100 group-hover:bg-sky-500 group-hover:text-white transition-all duration-500">
                  <Award className="w-7 h-7 text-slate-300 group-hover:text-white transition-colors" />
               </div>
               <div className="space-y-2">
                  <h4 className="font-black text-slate-900 uppercase tracking-widest text-[11px]">Phần thưởng</h4>
                  <p className="text-[12px] text-slate-400 leading-relaxed italic max-w-[200px] mx-auto opacity-70">Xây dựng thói quen tốt và nhận những huy hiệu danh giá.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
