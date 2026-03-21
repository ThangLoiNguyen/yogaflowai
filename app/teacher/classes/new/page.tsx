"use client";

import React, { useState, useTransition } from "react";
import { 
  Plus, 
  ArrowLeft, 
  Video, 
  Clock, 
  Users, 
  Zap,
  Calendar,
  Sparkles,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function CreateClassPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: 1, // 1-5
    intensity: 3, // 1-5
    price_per_session: 120000,
    duration_minutes: 60,
    max_students: 20,
    scheduled_at: "", // For the first session
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.scheduled_at) {
      toast.error("Vui lòng chọn thời gian bắt đầu buổi học đầu tiên.");
      return;
    }

    if (new Date(formData.scheduled_at) < new Date()) {
      toast.error("Thời gian bắt đầu không được ở trong quá khứ.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Chưa đăng nhập");

        // 1. Create Course
        const { data: course, error: courseError } = await supabase
          .from("courses")
          .insert({
            teacher_id: user.id,
            title: formData.title,
            description: formData.description,
            level: formData.level,
            intensity: formData.intensity,
            price_per_session: formData.price_per_session,
            max_students: formData.max_students
          })
          .select()
          .single();

        if (courseError) throw courseError;

        // 2. Create First Session
        const { error: sessionError } = await supabase
          .from("class_sessions")
          .insert({
            course_id: course.id,
            teacher_id: user.id,
            title: `Buổi học: ${formData.title}`,
            scheduled_at: new Date(formData.scheduled_at).toISOString(),
            duration_minutes: formData.duration_minutes,
            max_students: formData.max_students,
            video_mode: 'embedded',
            status: 'scheduled'
          });

        if (sessionError) throw sessionError;

        toast.success("Đã tạo khóa học và buổi dạy thành công!");
        router.push("/teacher/classes");
      } catch (err: any) {
        console.error("Create Class Error:", err);
        toast.error("Lỗi khi tạo lớp: " + err.message);
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-24">
      <header className="space-y-6">
        <Link href="/teacher/classes">
          <Button variant="ghost" className="mb-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] -ml-4">
            <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại quản lý
          </Button>
        </Link>
        <div className="flex items-center gap-4">
           <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
             <Video className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-4xl font-display italic">Tạo lớp dạy mới</h1>
              <p className="text-[var(--text-secondary)]">Khởi tạo một khóa học và lên lịch cho buổi tập đầu tiên.</p>
           </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Basic Info */}
        <div className="p-8 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm space-y-8">
           <div className="space-y-4">
              <label className="label-mono">Tên khóa học</label>
              <Input 
                placeholder="Vd: Vinyasa Yoga cho người mới bắt đầu" 
                className="h-14 text-lg rounded-xl border-2 focus:border-emerald-500"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
           </div>

           <div className="space-y-4">
              <label className="label-mono">Mô tả chi tiết</label>
              <textarea 
                placeholder="Mô tả về lợi ích, phong cách dạy của bạn..." 
                className="w-full h-32 p-4 rounded-xl border-2 border-[var(--border-medium)] focus:border-emerald-500 outline-none transition-all resize-none text-sm"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                 <label className="label-mono">Cấp độ (1-5)</label>
                 <Input 
                    type="number" min="1" max="5" 
                    className="h-12 rounded-xl"
                    value={formData.level}
                    onChange={e => setFormData({...formData, level: parseInt(e.target.value)})}
                 />
              </div>
              <div className="space-y-4">
                 <label className="label-mono">Cường độ (1-5)</label>
                 <Input 
                    type="number" min="1" max="5" 
                    className="h-12 rounded-xl"
                    value={formData.intensity}
                    onChange={e => setFormData({...formData, intensity: parseInt(e.target.value)})}
                 />
              </div>
           </div>
        </div>

        {/* Section 2: Schedule & Pricing */}
        <div className="p-8 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm space-y-8">
           <div className="space-y-4">
              <DateTimePicker 
                 value={formData.scheduled_at}
                 onChange={val => setFormData({...formData, scheduled_at: val})}
              />
              <p className="text-[10px] text-[var(--text-hint)] italic flex items-center gap-1">
                 <Info className="w-3 h-3" />Bạn có thể thêm các buổi tiếp theo sau khi tạo khóa học này.
              </p>
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                 <label className="label-mono">Thời lượng (phút)</label>
                 <div className="relative">
                    <Input 
                      type="number" 
                      className="h-12 rounded-xl pl-4"
                      value={formData.duration_minutes}
                      onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                    />
                    <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="label-mono">Học viên tối đa</label>
                 <div className="relative">
                    <Input 
                      type="number" 
                      className="h-12 rounded-xl pl-4"
                      value={formData.max_students}
                      onChange={e => setFormData({...formData, max_students: parseInt(e.target.value)})}
                    />
                    <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <label className="label-mono">Học phí (VND) / buổi</label>
              <div className="relative">
                 <Input 
                   type="number" 
                   className="h-14 rounded-xl pl-4 text-xl font-display"
                   value={formData.price_per_session}
                   onChange={e => setFormData({...formData, price_per_session: parseInt(e.target.value)})}
                 />
                 <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">VND</span>
              </div>
           </div>
        </div>

        {/* AI Insight for Creation */}
        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex gap-4">
           <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
             <Sparkles className="w-5 h-5 text-indigo-500" />
           </div>
           <p className="text-xs text-indigo-800 leading-relaxed font-medium">
             AI Tip: Các lớp Yoga dành cho người mới bắt đầu thường có nhu cầu cao nhất vào khung giờ 19:00 - 20:00. Hãy thử khung giờ này để thu hút nhiều học viên hơn!
           </p>
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="btn-primary w-full h-16 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald"
        >
          {isPending ? "Đang khởi tạo..." : "Khởi tạo khóa học và Buổi đầu tiên"}
          <Zap className="ml-2 w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
