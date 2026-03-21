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
      .select("*, users!teacher_id(full_name)")
      .eq("id", courseId)
      .single();

    if (error) {
      console.error(error);
      toast.error("Không tìm thấy khoá học.");
      router.push("/student/explore");
    } else {
      setCourse(data);
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

  if (loading || !course) return <div className="p-20 text-center animate-pulse text-2xl font-display text-[var(--accent)]">Đang tải khoá học...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại khám phá
      </button>

      <section className="grid md:grid-cols-12 gap-12 items-start">
         <div className="md:col-span-8 space-y-8">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-mono font-bold uppercase tracking-widest mb-6 shadow-sm">
                  Cấp độ {course.level} · 60 min
               </div>
               <h1 className="text-5xl mb-6">{course.title}</h1>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-[var(--accent)]">
                        {(course.users as any)?.full_name?.[0] || "L"}
                     </div>
                     <div>
                        <div className="text-sm font-bold text-[var(--text-primary)]">GV. {(course.users as any)?.full_name || "Linh Yoga"}</div>
                        <div className="text-[10px] label-mono uppercase text-[var(--text-hint)] tracking-tighter">Yoga Alliance Certified</div>
                     </div>
                  </div>
                  <div className="h-8 w-[1px] bg-[var(--border)]" />
                  <div className="flex items-center gap-2 text-sm font-bold text-orange-500 fill-orange-500">
                     <Star className="w-4 h-4" /> 5.0 <span className="text-[var(--text-hint)] font-normal">(124 đánh giá)</span>
                  </div>
               </div>
            </div>

            <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-ui">
               {course.description}
            </p>

            <div className="space-y-6 pt-6">
               <h3 className="text-2xl">Lợi ích bài tập</h3>
               <div className="grid sm:grid-cols-2 gap-4">
                  {(course.goals || ["Flexibility", "Inspiratory", "Calm", "Stability"]).map((f: string) => (
                    <div key={f} className="flex items-center gap-3 p-4 rounded-[var(--r-md)] bg-white border border-[var(--border)] shadow-sm">
                       <CheckCircle className="w-5 h-5 text-emerald-500" />
                       <span className="text-sm font-medium text-[var(--text-primary)]">{f}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="md:col-span-4 sticky top-12">
            <div className="p-8 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sky space-y-8">
               <div className="space-y-4">
                  <div className="text-[10px] label-mono uppercase text-[var(--text-hint)]">Thông tin khoá học</div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                     <Clock className="w-5 h-5 text-[var(--accent)]" />
                     {course.sessions_per_week || 3} buổi / tuần
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                     <Video className="w-5 h-5 text-red-500" />
                     Nền tảng: LiveKit (Học trực tuyến)
                  </div>
               </div>

               <div className="h-[1px] bg-[var(--bg-muted)]" />

               <div className="space-y-4">
                  <div className="flex items-baseline justify-between mb-4">
                     <span className="text-2xl font-display text-[var(--text-primary)]">
                        {Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price_per_session || 120000)} / buổi
                     </span>
                  </div>
                  <Button 
                    onClick={handleEnroll}
                    disabled={isPending}
                    className="btn-primary w-full h-14 text-lg shadow-sky"
                  >
                    {isPending ? "Đang xử lý..." : "Đăng ký lớp học ngay"}
                  </Button>
                  <Button variant="ghost" className="w-full h-12 text-[var(--text-secondary)] hover:text-[var(--accent)] font-medium text-xs">Phí quản lý: 0đ</Button>
               </div>

               <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex gap-3">
                  <Zap className="w-5 h-5 text-[var(--accent)] shrink-0" />
                  <p className="text-[11px] text-indigo-800 leading-relaxed font-medium">
                     AI đề xuất: Lớp này khớp 95% với hồ sơ của bạn và sẽ tự động gửi feedback tới giáo viên sau buổi học.
                  </p>
               </div>
            </div>
         </div>
      </section>

      <section className="bg-[var(--bg-sky)] border border-[var(--accent-light)] rounded-[var(--r-xl)] p-12 text-center space-y-12">
         <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-3xl">Gói trọn trải nghiệm cá nhân hóa</h3>
            <p className="text-[var(--text-secondary)]">Không chỉ là một lớp học, đây là hành trình thấu hiểu cơ thể cùng AI.</p>
         </div>
         <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
               <div className="w-12 h-12 rounded-full bg-white mx-auto shadow-sm flex items-center justify-center">
                  <Map className="w-6 h-6 text-[var(--accent)]" />
               </div>
               <h4 className="font-bold">Lộ trình động</h4>
               <p className="text-xs text-[var(--text-secondary)] leading-relaxed">AI điều chỉnh nội dung buổi sau dựa trên thực hiện buổi trước.</p>
            </div>
            <div className="space-y-4">
               <div className="w-12 h-12 rounded-full bg-white mx-auto shadow-sm flex items-center justify-center">
                  <Star className="w-6 h-6 text-amber-500" />
               </div>
               <h4 className="font-bold">Giáo viên thấu hiểu</h4>
               <p className="text-xs text-[var(--text-secondary)] leading-relaxed">GV nhận gợi ý cụ thể từ AI về từng điểm hạn chế của bạn.</p>
            </div>
            <div className="space-y-4">
               <div className="w-12 h-12 rounded-full bg-white mx-auto shadow-sm flex items-center justify-center">
                  <Award className="w-6 h-6 text-emerald-500" />
               </div>
               <h4 className="font-bold">Phần thưởng & Badges</h4>
               <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Nhận huy hiệu và điểm thưởng khi duy trì chuỗi luyện tập.</p>
            </div>
         </div>
      </section>
    </div>
  );
}
