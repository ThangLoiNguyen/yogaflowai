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

  if (loading || !course) return <div className="p-20 text-center animate-pulse text-2xl font-display text-sky-500">Đang tải khoá học...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại khám phá
      </button>

      <section className="grid md:grid-cols-12 gap-12 items-start">
         <div className="md:col-span-8 space-y-8">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-[10px] font-mono font-bold uppercase tracking-widest mb-6 shadow-sm">
                  Cấp độ {course.level} · 60 phút
               </div>
               <h1 className="text-3xl mb-6 text-slate-900 border-none font-black italic">{course.title}</h1>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                     <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center font-bold text-sky-500">
                        {(course.users as any)?.full_name?.[0] || "L"}
                     </div>
                     <div>
                        <div className="text-sm font-bold text-slate-900">GV. {(course.users as any)?.full_name || "Giảng viên"}</div>
                        <div className="text-[10px] uppercase text-slate-400 tracking-tighter font-mono">Giảng viên YogAI</div>
                     </div>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-100" />
                  {course.avg_rating != null ? (
                    <div className="flex items-center gap-2 text-sm font-bold text-sky-500">
                       <Star className="w-4 h-4 fill-sky-500" />
                       {course.avg_rating.toFixed(1)} <span className="text-slate-400 font-normal text-xs">({course.review_count} đánh giá)</span>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400">Chưa có đánh giá</div>
                  )}
               </div>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed font-ui italic">
               "{course.description}"
            </p>

            <div className="space-y-6 pt-6">
               <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 border-none">Lợi ích bài tập</h3>
               <div className="grid sm:grid-cols-2 gap-4">
                  {(course.goals || ["Dẻo dai", "Hơi thở", "Tĩnh tâm", "Cân bằng"]).map((f: string) => (
                    <div key={f} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                       <CheckCircle className="w-5 h-5 text-sky-500" />
                       <span className="text-sm font-medium text-slate-700">{f}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="md:col-span-4 sticky top-12">
            <div className="p-5 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-sky-100/50 space-y-8">
               <div className="space-y-4">
                  <div className="text-[10px] uppercase text-slate-400 font-mono tracking-widest">Thông tin khoá học</div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-900">
                     <Clock className="w-5 h-5 text-sky-500" />
                     {course.sessions_per_week || 3} buổi / tuần
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-900">
                     <Video className="w-5 h-5 text-sky-400" />
                     Nền tảng: LiveKit (Học trực tuyến)
                  </div>
               </div>

               <div className="h-[1px] bg-slate-50" />

               <div className="space-y-4">
                  <div className="flex items-baseline justify-between mb-4">
                     <span className="text-2xl font-black text-slate-900">
                        {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price_per_session || 120000)} / buổi
                     </span>
                  </div>
                  <Button 
                    onClick={handleEnroll}
                    disabled={isPending}
                    className="w-full h-11 bg-sky-500 hover:bg-sky-600 text-white font-black uppercase tracking-widest text-xs shadow-lg shadow-sky-100"
                  >
                    {isPending ? "Đang xử lý..." : "Đăng ký lớp học ngay"}
                  </Button>
                  <Button variant="ghost" className="w-full h-9 text-slate-400 hover:text-sky-600 font-medium text-xs">Phí quản lý: 0đ</Button>
               </div>

               <div className="p-4 bg-sky-50/50 rounded-xl border border-sky-100 flex gap-3">
                  <Zap className="w-5 h-5 text-sky-500 shrink-0" />
                  <p className="text-[11px] text-sky-800 leading-relaxed font-medium italic">
                     AI đề xuất: Lớp này khớp 95% với hồ sơ của bạn và sẽ tự động gửi feedback tới giáo viên sau buổi học.
                  </p>
               </div>
            </div>
         </div>
      </section>

      <section className="bg-sky-50/30 border border-sky-100 rounded-[2.5rem] p-12 text-center space-y-12">
         <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-black italic text-slate-900 border-none leading-none">Gói trọn trải nghiệm cá nhân hóa</h3>
            <p className="text-slate-500 italic">Không chỉ là một lớp học, đây là hành trình thấu hiểu cơ thể cùng AI.</p>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
               <div className="w-10 h-10 rounded-2xl bg-white mx-auto shadow-sm flex items-center justify-center">
                  <Map className="w-6 h-6 text-sky-500" />
               </div>
               <h4 className="font-bold text-slate-900">Lộ trình động</h4>
               <p className="text-[11px] text-slate-500 leading-relaxed italic">AI điều chỉnh nội dung buổi sau dựa trên thực hiện buổi trước.</p>
            </div>
            <div className="space-y-4">
               <div className="w-10 h-10 rounded-2xl bg-white mx-auto shadow-sm flex items-center justify-center">
                  <Star className="w-6 h-6 text-sky-500" />
               </div>
               <h4 className="font-bold text-slate-900">Giáo viên thấu hiểu</h4>
               <p className="text-[11px] text-slate-500 leading-relaxed italic">GV nhận gợi ý cụ thể từ AI về từng điểm hạn chế của bạn.</p>
            </div>
            <div className="space-y-4">
               <div className="w-10 h-10 rounded-2xl bg-white mx-auto shadow-sm flex items-center justify-center">
                  <Award className="w-6 h-6 text-sky-500" />
               </div>
               <h4 className="font-bold text-slate-900">Phần thưởng & Badges</h4>
               <p className="text-[11px] text-slate-500 leading-relaxed italic">Nhận huy hiệu và điểm thưởng khi duy trì chuỗi luyện tập.</p>
            </div>
         </div>
      </section>
    </div>
  );
}
