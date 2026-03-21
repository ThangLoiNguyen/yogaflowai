"use client";

import React, { useState, useEffect, useTransition } from "react";
import { 
  Save, 
  ArrowLeft, 
  Video, 
  Clock, 
  Users, 
  Zap,
  Calendar,
  Sparkles,
  Info,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: 1,
    intensity: 3,
    price_per_session: 120000,
    max_students: 20,
    scheduled_at: "",
    duration_minutes: 60,
  });

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      
      // Load Course
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("*")
        .eq("id", courseId)
        .single();
      
      if (courseError) {
        toast.error("Không tìm thấy khóa học");
        router.push("/teacher/classes");
        return;
      }

      // Load First/Next Session
      const { data: session } = await supabase
        .from("class_sessions")
        .select("*")
        .eq("course_id", courseId)
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .single();

      if (session) {
        setSessionId(session.id);
        const dateStr = new Date(session.scheduled_at).toISOString().slice(0, 16);
        setFormData({
          title: course.title,
          description: course.description || "",
          level: course.level || 1,
          intensity: course.intensity || 3,
          price_per_session: course.price_per_session ? Number(course.price_per_session) : 120000,
          max_students: course.max_students || 20,
          scheduled_at: dateStr,
          duration_minutes: session.duration_minutes || 60,
        });
      } else {
        setFormData({
          title: course.title,
          description: course.description || "",
          level: course.level || 1,
          intensity: course.intensity || 3,
          price_per_session: course.price_per_session ? Number(course.price_per_session) : 120000,
          max_students: course.max_students || 20,
          scheduled_at: "",
          duration_minutes: 60,
        });
      }
      setLoading(false);
    }
    loadData();
  }, [courseId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.scheduled_at && new Date(formData.scheduled_at) < new Date()) {
       toast.error("Thời gian học không thể ở quá khứ.");
       return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        
        // 1. Update Course
        const { error: courseError } = await supabase
          .from("courses")
          .update({
            title: formData.title,
            description: formData.description,
            level: formData.level,
            intensity: formData.intensity,
            price_per_session: formData.price_per_session,
            max_students: formData.max_students,
          })
          .eq("id", courseId);

        if (courseError) throw courseError;

        // 2. Update Session if exists
        if (sessionId) {
          const { error: sessionError } = await supabase
            .from("class_sessions")
            .update({
              title: `Buổi học: ${formData.title}`,
              scheduled_at: new Date(formData.scheduled_at).toISOString(),
              duration_minutes: formData.duration_minutes,
              max_students: formData.max_students,
            })
            .eq("id", sessionId);
          
          if (sessionError) throw sessionError;
        }

        toast.success("Đã cập nhật khóa học và lịch học!");
        router.push("/teacher/classes");
      } catch (err: any) {
        toast.error("Lỗi: " + err.message);
      }
    });
  };

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa khóa học này? Mọi buổi học liên quan sẽ bị xóa.")) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase.from("courses").delete().eq("id", courseId);
      if (error) throw error;
      toast.success("Đã xóa khóa học");
      router.push("/teacher/classes");
    } catch (err: any) {
      toast.error("Lỗi khi xóa: " + err.message);
    }
  };

  if (loading) return <div className="p-20 text-center">Đang tải thông tin...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-24">
      <header className="space-y-6">
        <Link href="/teacher/classes">
          <Button variant="ghost" className="mb-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] -ml-4">
            <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại
          </Button>
        </Link>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
                    <Calendar className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-2xl font-display italic">Chỉnh sửa lớp</h1>
                    <p className="text-[var(--text-secondary)]">Cập nhật thông tin chi tiết và thời gian dạy.</p>
                </div>
            </div>
            <Button variant="ghost" onClick={handleDelete} className="text-red-400 hover:text-red-600 hover:bg-red-50 h-10 w-10 rounded-full p-0">
                <Trash2 className="w-6 h-6" />
            </Button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Course Info */}
        <div className="p-5 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm space-y-8">
           <div className="space-y-4">
              <label className="label-mono">Tên khóa học</label>
              <Input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="h-10 text-lg rounded-xl border-2 focus:border-amber-500"
                required
              />
           </div>

           <div className="space-y-4">
              <label className="label-mono">Mô tả</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full h-32 p-4 rounded-xl border-2 border-[var(--border-medium)] focus:border-amber-500 outline-none transition-all resize-none text-sm"
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                 <label className="label-mono">Cấp độ (1-5)</label>
                 <Input 
                    type="number" min="1" max="5" 
                    value={formData.level}
                    onChange={e => setFormData({...formData, level: parseInt(e.target.value)})}
                    className="h-9 rounded-xl"
                 />
              </div>
              <div className="space-y-4">
                 <label className="label-mono">Cường độ (1-5)</label>
                 <Input 
                    type="number" min="1" max="5" 
                    value={formData.intensity}
                    onChange={e => setFormData({...formData, intensity: parseInt(e.target.value)})}
                    className="h-9 rounded-xl"
                 />
              </div>
           </div>
        </div>

        {/* Schedule Info */}
        <div className="p-5 bg-white border border-[var(--border)] rounded-[var(--r-xl)] shadow-sm space-y-8">
           <div className="space-y-4">
              <DateTimePicker 
                 value={formData.scheduled_at}
                 onChange={val => setFormData({...formData, scheduled_at: val})}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                 <label className="label-mono">Thời lượng (phút)</label>
                 <Input 
                    type="number"
                    value={formData.duration_minutes}
                    onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                    className="h-9 rounded-xl"
                 />
              </div>
              <div className="space-y-4">
                 <label className="label-mono">Học viên tối đa</label>
                 <Input 
                    type="number"
                    value={formData.max_students}
                    onChange={e => setFormData({...formData, max_students: parseInt(e.target.value)})}
                    className="h-9 rounded-xl"
                 />
              </div>
           </div>

           <div className="space-y-4">
              <label className="label-mono">Học phí (VND)</label>
              <Input 
                 type="number"
                 value={formData.price_per_session}
                 onChange={e => setFormData({...formData, price_per_session: parseInt(e.target.value)})}
                 className="h-9 rounded-xl"
              />
           </div>
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="btn-primary w-full h-16 text-lg bg-amber-600 hover:bg-amber-700 shadow-amber-200"
        >
          {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          <Save className="ml-2 w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
