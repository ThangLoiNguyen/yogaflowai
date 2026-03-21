"use client";

import React from "react";
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
import { useRouter } from "next/navigation";

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Mock course data
  const course = {
    id: params.id,
    title: "Vinyasa Flow Morning Energy",
    teacher: "Linh Nguyen",
    level: "Intermediate",
    duration: "45 min",
    intensity: "Moderate",
    rating: 4.8,
    reviews: 124,
    description: "Lớp học Vinyasa tập trung vào hơi thở và sự linh hoạt của chuyển động. Phù hợp để bắt đầu ngày mới tràn đầy năng lượng.",
    features: [
      "Hơi thở Ujjayi Pranayama",
      "Chào mặt trời A & B",
      "Thăng bằng tay cơ bản",
      "Thư giãn Savasana sâu"
    ],
    schedule: "Thứ 2, 4, 6 · 07:00 - 07:45",
    price: "120.000đ / buổi"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      {/* Back & Breadcrumb */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại khám phá
      </button>

      {/* Hero Section */}
      <section className="grid md:grid-cols-12 gap-12 items-start">
         <div className="md:col-span-8 space-y-8">
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-mono font-bold uppercase tracking-widest mb-6 shadow-sm">
                  {course.level} · {course.duration}
               </div>
               <h1 className="text-5xl mb-6">{course.title}</h1>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                     <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-[var(--accent)]">L</div>
                     <div>
                        <div className="text-sm font-bold text-[var(--text-primary)]">GV. {course.teacher}</div>
                        <div className="text-[10px] label-mono uppercase text-[var(--text-hint)] tracking-tighter">Yoga Alliance Certified</div>
                     </div>
                  </div>
                  <div className="h-8 w-[1px] bg-[var(--border)]" />
                  <div className="flex items-center gap-2 text-sm font-bold text-orange-500 fill-orange-500">
                     <Star className="w-4 h-4" /> {course.rating} <span className="text-[var(--text-hint)] font-normal">({course.reviews} đánh giá)</span>
                  </div>
               </div>
            </div>

            <p className="text-xl text-[var(--text-secondary)] leading-relaxed font-ui">
               {course.description}
            </p>

            <div className="space-y-6 pt-6">
               <h3 className="text-2xl">Nội dung bài tập</h3>
               <div className="grid sm:grid-cols-2 gap-4">
                  {course.features.map(f => (
                    <div key={f} className="flex items-center gap-3 p-4 rounded-[var(--r-md)] bg-white border border-[var(--border)] shadow-sm">
                       <CheckCircle className="w-5 h-5 text-emerald-500" />
                       <span className="text-sm font-medium text-[var(--text-primary)]">{f}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar / Booking Card */}
         <div className="md:col-span-4 sticky top-12">
            <div className="p-8 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sky space-y-8">
               <div className="space-y-4">
                  <div className="text-[10px] label-mono uppercase text-[var(--text-hint)]">Lịch học cố định</div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                     <Clock className="w-5 h-5 text-[var(--accent)]" />
                     {course.schedule}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[var(--text-primary)]">
                     <Video className="w-5 h-5 text-red-500" />
                     Nền tảng: LiveKit (Học trực tuyến)
                  </div>
               </div>

               <div className="h-[1px] bg-[var(--bg-muted)]" />

               <div className="space-y-4">
                  <div className="flex items-baseline justify-between mb-4">
                     <span className="text-2xl font-display text-[var(--text-primary)]">{course.price}</span>
                     <span className="text-xs text-[var(--text-hint)]">Không cam kết tháng</span>
                  </div>
                  <Button className="btn-primary w-full h-14 text-lg">Đăng ký lớp học ngay</Button>
                  <Button variant="ghost" className="w-full h-12 text-[var(--text-secondary)] hover:text-[var(--accent)] font-medium text-xs">Phí thành viên: 0đ</Button>
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

      {/* Benefits */}
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
